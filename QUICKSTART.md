# Quick Start Guide - TravelExplorer

Get the TravelExplorer travel booking system up and running in **2 MINUTES**!

## ⚡ Quick Local Setup (2 minutes!)

### Prerequisites Check
```bash
node --version  # Should be v14 or higher
```

**That's it!** No database installation required! 🎉

If you don't have Node.js:
- **Node.js**: Download from [nodejs.org](https://nodejs.org/)

### Step 1: Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies (takes ~1 minute)
npm install

# Start backend server - that's all!
npm start
```

✅ Backend should now be running at `http://localhost:3000`

The server will automatically:
- Load 6 sample travel packages
- Use in-memory storage (no database needed)
- Be ready to accept requests!

**Note**: Data is stored in memory and will reset when the server restarts.

Test it: Open `http://localhost:3000/api/health` in your browser

### Step 2: Setup Frontend
```bash
# Open a new terminal window
cd frontend

# Option 1: Using Python (if installed)
python3 -m http.server 8080
# or Python 2
python -m SimpleHTTPServer 8080

# Option 2: Using Node.js http-server
npx http-server -p 8080

# Option 3: Using VS Code Live Server extension
# Right-click index.html > Open with Live Server
```

✅ Frontend should now be running at `http://localhost:8080`

### Step 3: Test the Application

1. **Open** `http://localhost:8080` in your browser
2. **Register** a new account (top right button)
3. **Browse** destinations page
4. **Book** a trip
5. **View** your bookings in the dashboard

## 🚀 Quick AWS Deploy (15 minutes)

### Prerequisites
- AWS account
- EC2 instance launched (Ubuntu 20.04)
- SSH access to your EC2 instance

### Step 1: Connect to EC2
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

### Step 2: Upload Project
```bash
# From your local machine
scp -i your-key.pem -r Abood-project ubuntu@YOUR_EC2_IP:~/
```

### Step 3: Run Deployment Scripts
```bash
# On EC2 instance
cd ~/Abood-project

# Deploy backend (installs Node.js, MongoDB, PM2)
chmod +x deployment/deploy-backend.sh
./deployment/deploy-backend.sh

# Deploy frontend (installs Nginx, configures web server)
chmod +x deployment/deploy-frontend.sh
./deployment/deploy-frontend.sh
```

### Step 4: Access Your App
- Frontend: `http://YOUR_EC2_IP`
- Backend API: `http://YOUR_EC2_IP:3000/api`

## 📱 Using the Application

### As a User

1. **Register/Login**
   - Click "Sign Up" in navigation
   - Fill in your details
   - You'll be automatically logged in

2. **Browse Destinations**
   - Click "Destinations" in navigation
   - Use filters to narrow down options:
     - Search by destination
     - Filter by category (Adventure, Luxury, etc.)
     - Set max price
     - Set preferred duration
   - Sort packages by price, duration, or rating

3. **Book a Trip**
   - Click "Book Now" on any package
   - Or go to "Book Now" in navigation
   - Select package, date, and number of travelers
   - Fill in contact information
   - Submit booking

4. **Manage Bookings**
   - Click "My Trips" in navigation
   - View all your bookings
   - Click "View Details" for full information
   - Cancel bookings if needed

5. **Contact Support**
   - Click "Contact" in navigation
   - Fill in the contact form
   - Submit your inquiry

### Sample Test Account
You can register your own account. There's no pre-created test account for security reasons.

### Sample Packages Available
The server automatically loads 6 sample packages on startup:
1. Paris Romantic Getaway ($1,299, 5 days)
2. Bali Beach Paradise ($899, 7 days)
3. Swiss Alps Adventure ($1,599, 6 days)
4. Tokyo Family Experience ($1,499, 8 days)
5. Egyptian Treasures ($1,099, 7 days)
6. Budget Europe Backpacker ($699, 10 days)

## 🔧 Common Commands

### Backend
```bash
# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Check server is running
curl http://localhost:3000/api/health

# Check packages are loaded
curl http://localhost:3000/api/packages
```

**Note**: Data resets when the server restarts (in-memory storage).

### PM2 (Production)
```bash
# View status
pm2 status

# View logs
pm2 logs travel-backend

# Restart server
pm2 restart travel-backend

# Stop server
pm2 stop travel-backend
```

### Viewing Data
Since this version uses in-memory storage, you can view data through the API:

```bash
# View all packages
curl http://localhost:3000/api/packages

# View a specific package
curl http://localhost:3000/api/packages/<package-id>

# View your bookings (requires authentication token)
curl -H "Authorization: Bearer <your-token>" http://localhost:3000/api/bookings/my-bookings
```

## 🐛 Quick Troubleshooting

### "Port 3000 already in use"
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
kill -9 <PID>
```

### "Frontend can't connect to backend"
1. Check backend is running: `curl http://localhost:3000/api/health`
2. Verify `frontend/js/config.js` has correct API URL
3. Check browser console for CORS errors

### "Permission denied" errors
```bash
# Make scripts executable
chmod +x deployment/*.sh

# Fix file permissions
sudo chown -R $USER:$USER .
```

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Read [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md) for complete AWS guide
- Review API endpoints in README
- Customize the application for your needs

## 💡 Tips

1. **Development**: Use `npm run dev` for auto-reload
2. **Testing**: Sample packages are automatically loaded on startup
3. **Security**: Change JWT_SECRET in production (in .env file)
4. **Data Persistence**: Data resets on server restart (in-memory storage)
5. **Performance**: Enable PM2 cluster mode for production
6. **SSL**: Set up HTTPS with Let's Encrypt for production

## 📝 About In-Memory Storage

This version uses **in-memory storage** which means:
- ✅ No database installation required
- ✅ Quick setup (2 minutes!)
- ✅ Perfect for development and testing
- ✅ Pre-loaded with sample data
- ⚠️ Data resets when server restarts
- ⚠️ Not suitable for production without database backup

For production with persistent storage, consider adding a database like MongoDB, PostgreSQL, or MySQL.

## 🆘 Need Help?

1. Check the main [README.md](README.md)
2. Check [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md) for AWS-specific issues
3. Review error logs:
   - Backend: `pm2 logs travel-backend`
   - MongoDB: `sudo tail -f /var/log/mongodb/mongod.log`
   - Nginx: `sudo tail -f /var/log/nginx/error.log`

---

**Happy Traveling!** ✈️🌍
