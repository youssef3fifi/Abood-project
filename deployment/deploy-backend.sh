#!/bin/bash

# Backend Deployment Script for AWS EC2
# This script sets up and deploys the Node.js backend on an EC2 instance

echo "======================================"
echo "TravelExplorer Backend Deployment"
echo "======================================"

# Update system packages
echo "Updating system packages..."
sudo apt-get update

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install MongoDB (if not already installed)
if ! command -v mongod &> /dev/null; then
    echo "Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

# Install PM2 globally (for process management)
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Navigate to backend directory
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file with your configuration:"
    echo "   - Set MONGODB_URI to your MongoDB connection string"
    echo "   - Set JWT_SECRET to a secure random string"
    echo "   - Set FRONTEND_URL to your frontend URL or '*' for development"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
fi

# Seed the database with sample data
echo "Do you want to seed the database with sample packages? (y/n)"
read -r seed_response
if [[ "$seed_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Seeding database..."
    npm run seed
fi

# Stop existing PM2 process if running
pm2 delete travel-backend 2>/dev/null || true

# Start the backend with PM2
echo "Starting backend server with PM2..."
pm2 start server.js --name travel-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
sudo pm2 startup systemd -u $USER --hp $HOME
pm2 save

echo ""
echo "======================================"
echo "✅ Backend deployment completed!"
echo "======================================"
echo ""
echo "Backend is running on port 3000"
echo ""
echo "Useful PM2 commands:"
echo "  pm2 status              - Check process status"
echo "  pm2 logs travel-backend - View logs"
echo "  pm2 restart travel-backend - Restart server"
echo "  pm2 stop travel-backend - Stop server"
echo ""
echo "⚠️  Make sure to configure your EC2 security group to allow:"
echo "   - Inbound traffic on port 3000 (or your configured PORT)"
echo "   - Outbound traffic to MongoDB if using external database"
echo ""
