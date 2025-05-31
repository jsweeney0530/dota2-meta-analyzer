# 🚀 Quick Start Guide

## Your repository is ready! 🎉

I've created your Dota 2 Patch Analyzer at:
**https://github.com/jsweeney0530/dota2-meta-analyzer**

## Next Steps:

### 1. Clone Your Repository
```bash
git clone https://github.com/jsweeney0530/dota2-meta-analyzer.git
cd dota2-meta-analyzer
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Start the Backend Server
```bash
npm start
```
You should see: "Dota 2 Patch Analyzer backend running on http://localhost:3001"

### 4. Open the Frontend
1. Keep the backend server running
2. Open a new terminal/file explorer
3. Navigate to the `frontend` folder
4. Double-click `index.html` to open in your browser
5. Click "Analyze Meta" to see real hero data!

## Try the Demo First!
If you want to see how it works without setting up the backend:
1. Open `demo/index.html` in your browser
2. Click "Load Sample Heroes"
3. This shows sample data without needing the backend

## Troubleshooting

### "Failed to fetch" error?
- Make sure the backend server is running on port 3001
- Check that you ran `npm install` in the backend folder
- Try refreshing the page

### Port 3001 already in use?
- Change the port in `backend/.env` to another number (like 3002)
- Update the port in `frontend/index.html` to match

## What's Included:

✅ **Backend Server** - Handles API requests and avoids CORS issues
✅ **Frontend App** - React-based web interface with charts
✅ **Demo Version** - Works without backend, uses sample data
✅ **Full Documentation** - README with all details

## Need Help?
- Check the main README.md for detailed documentation
- Make sure Node.js is installed: https://nodejs.org/
- The OpenDota API key is already included in the code

Enjoy your Dota 2 Patch Analyzer! 🎮
