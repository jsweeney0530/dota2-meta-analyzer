const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cache configuration
const cache = new Map();
const CACHE_DURATION = 3600000; // 1 hour

// OpenDota API configuration
const OPENDOTA_API_KEY = process.env.OPENDOTA_API_KEY || 'c5f92e69-8546-4a43-b6ba-d5ed18c1e729';
const OPENDOTA_BASE_URL = 'https://api.opendota.com/api';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Dota 2 Patch Analyzer API is running' });
});

// Get hero stats endpoint
app.get('/api/heroes', async (req, res) => {
  const { patch, rank } = req.query;
  const cacheKey = `heroes-${patch}-${rank}`;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached data for:', cacheKey);
      return res.json(cached.data);
    }
  }
  
  try {
    console.log('Fetching fresh data from OpenDota API...');
    const response = await axios.get(
      `${OPENDOTA_BASE_URL}/heroStats`,
      {
        params: { api_key: OPENDOTA_API_KEY },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Dota2-Patch-Analyzer/1.0'
        }
      }
    );
    
    // Cache the response
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hero data:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch hero data',
      message: error.message 
    });
  }
});

// Get specific hero details
app.get('/api/hero/:heroId', async (req, res) => {
  const { heroId } = req.params;
  const cacheKey = `hero-${heroId}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json(cached.data);
    }
  }
  
  try {
    // Fetch hero stats
    const statsResponse = await axios.get(
      `${OPENDOTA_BASE_URL}/heroStats`,
      {
        params: { api_key: OPENDOTA_API_KEY }
      }
    );
    
    const heroData = statsResponse.data.find(h => h.id === parseInt(heroId));
    
    if (!heroData) {
      return res.status(404).json({ error: 'Hero not found' });
    }
    
    // Fetch additional hero match data
    const matchesResponse = await axios.get(
      `${OPENDOTA_BASE_URL}/heroes/${heroId}/matches`,
      {
        params: { api_key: OPENDOTA_API_KEY }
      }
    );
    
    const enrichedData = {
      ...heroData,
      recentMatches: matchesResponse.data.slice(0, 10)
    };
    
    // Cache the response
    cache.set(cacheKey, {
      data: enrichedData,
      timestamp: Date.now()
    });
    
    res.json(enrichedData);
  } catch (error) {
    console.error('Error fetching hero details:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch hero details',
      message: error.message 
    });
  }
});

// Get patch notes (mock endpoint - you'd integrate with real patch notes source)
app.get('/api/patches/:patchVersion', (req, res) => {
  const { patchVersion } = req.params;
  
  // Mock patch notes data
  const patchNotes = {
    '7.37': {
      version: '7.37',
      date: '2024-08-01',
      changes: {
        'Pudge': [
          { type: 'buff', description: 'Hook damage increased by 25' },
          { type: 'buff', description: 'Flesh Heap magic resistance increased' }
        ],
        'Invoker': [
          { type: 'nerf', description: 'Tornado lift duration reduced' }
        ]
      }
    },
    '7.36': {
      version: '7.36',
      date: '2024-06-15',
      changes: {
        'Anti-Mage': [
          { type: 'nerf', description: 'Blink cooldown increased' }
        ]
      }
    }
  };
  
  const patch = patchNotes[patchVersion];
  if (patch) {
    res.json(patch);
  } else {
    res.status(404).json({ error: 'Patch not found' });
  }
});

// Clear cache endpoint (for admin use)
app.post('/api/cache/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Dota 2 Patch Analyzer backend running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/heroes');
  console.log('  GET  /api/hero/:heroId');
  console.log('  GET  /api/patches/:patchVersion');
  console.log('  POST /api/cache/clear');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
  });
});