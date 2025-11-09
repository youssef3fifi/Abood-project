# AWS EC2 Deployment Guide for TravelExplorer

This guide provides step-by-step instructions for deploying the TravelExplorer travel booking system on AWS EC2.

## 📋 Prerequisites

- AWS account with billing enabled
- Basic knowledge of Linux command line
- SSH client (Terminal on Mac/Linux, PuTTY on Windows)
- Your project files ready for deployment

## 🚀 Step 1: Launch EC2 Instance

### 1.1 Sign in to AWS Console
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to EC2 Dashboard

### 1.2 Launch Instance
1. Click **"Launch Instance"**
2. **Name**: Enter "TravelExplorer-Server" (or your preferred name)
3. **Application and OS Images (AMI)**:
   - Select **Ubuntu Server 20.04 LTS (HVM), SSD Volume Type**
   - Architecture: **64-bit (x86)**

4. **Instance Type**:
   - Select **t2.micro** (Free tier eligible) or **t2.small** for better performance
   - Minimum recommended: t2.small (2 vCPU, 2 GB RAM)

5. **Key Pair**:
   - Create new key pair or select existing
   - Name: `travelexplorer-key`
   - Type: RSA
   - Format: .pem (for Mac/Linux) or .ppk (for Windows/PuTTY)
   - **Important**: Download and save the key file securely

6. **Network Settings**:
   - Click **"Edit"** on Network settings
   - Configure Security Group (see section 1.3)

7. **Configure Storage**:
   - Size: **20 GB** minimum (recommended: 30 GB)
   - Volume Type: **gp3** (general purpose SSD)

8. Click **"Launch Instance"**

### 1.3 Security Group Configuration

Create a security group with these inbound rules:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access (restrict to your IP) |
| HTTP | TCP | 80 | 0.0.0.0/0 | Frontend web access |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | Backend API access |
| Custom TCP | TCP | 27017 | 127.0.0.1/32 | MongoDB (localhost only) |

**Security Best Practices**:
- Restrict SSH (port 22) to your IP address only
- After testing, consider restricting port 3000 to specific IPs
- Never expose MongoDB port 27017 to the internet

## 🔌 Step 2: Connect to EC2 Instance

### 2.1 Get Instance Details
1. In EC2 Dashboard, select your instance
2. Copy the **Public IPv4 address** (e.g., 54.123.45.67)
3. Note the **Public IPv4 DNS** (e.g., ec2-54-123-45-67.compute-1.amazonaws.com)

### 2.2 Connect via SSH

**On Mac/Linux:**
```bash
# Set key permissions
chmod 400 /path/to/travelexplorer-key.pem

# Connect to instance
ssh -i /path/to/travelexplorer-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**On Windows (using PuTTY):**
1. Open PuTTY
2. Host Name: `ubuntu@YOUR_EC2_PUBLIC_IP`
3. Connection > SSH > Auth: Browse and select your .ppk key file
4. Click "Open"

## 📦 Step 3: Setup Server Environment

### 3.1 Update System
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 3.2 Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v  # Should show v18.x.x
npm -v   # Should show npm version
```

### 3.3 Install MongoDB
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 3.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 3.5 Install Nginx (Web Server)
```bash
sudo apt-get install -y nginx
```

## 📂 Step 4: Deploy Application Files

### 4.1 Option A: Clone from Git Repository
```bash
# Install Git if not already installed
sudo apt-get install -y git

# Clone your repository
git clone https://github.com/your-username/Abood-project.git
cd Abood-project
```

### 4.2 Option B: Upload Files via SCP

**From your local machine:**
```bash
# Upload entire project
scp -i /path/to/key.pem -r /path/to/Abood-project ubuntu@YOUR_EC2_IP:~/

# Or upload as zip
zip -r abood-project.zip Abood-project/
scp -i /path/to/key.pem abood-project.zip ubuntu@YOUR_EC2_IP:~/
```

**On EC2 instance:**
```bash
# If uploaded as zip
sudo apt-get install -y unzip
unzip abood-project.zip
cd Abood-project
```

## ⚙️ Step 5: Configure Backend

### 5.1 Install Backend Dependencies
```bash
cd ~/Abood-project/backend
npm install
```

### 5.2 Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit environment file
nano .env
```

**Update the following in .env:**
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/travel-system
JWT_SECRET=CHANGE_THIS_TO_RANDOM_SECURE_STRING_12345
JWT_EXPIRE=7d
FRONTEND_URL=http://YOUR_EC2_PUBLIC_IP
```

**To generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### 5.3 Seed Database (Optional)
```bash
npm run seed
```

### 5.4 Start Backend with PM2
```bash
# Start the server
pm2 start server.js --name travel-backend

# Configure PM2 to start on system boot
pm2 startup systemd
# Copy and run the command that PM2 outputs

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs travel-backend
```

**Useful PM2 Commands:**
```bash
pm2 restart travel-backend  # Restart server
pm2 stop travel-backend     # Stop server
pm2 delete travel-backend   # Remove from PM2
pm2 logs travel-backend     # View logs
pm2 monit                   # Monitor resources
```

## 🌐 Step 6: Configure Frontend

### 6.1 Update API Configuration
```bash
cd ~/Abood-project/frontend/js

# Create config file from example
cp config.example.js config.js

# Edit config
nano config.js
```

**Update with your EC2 public IP:**
```javascript
const CONFIG = {
  API_BASE_URL: 'http://YOUR_EC2_PUBLIC_IP:3000/api'
};
```

### 6.2 Deploy Frontend with Nginx
```bash
# Create web directory
sudo mkdir -p /var/www/travelexplorer

# Copy frontend files
sudo cp -r ~/Abood-project/frontend/* /var/www/travelexplorer/

# Set permissions
sudo chown -R www-data:www-data /var/www/travelexplorer
sudo chmod -R 755 /var/www/travelexplorer
```

### 6.3 Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/travelexplorer
```

**Add this configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name YOUR_EC2_PUBLIC_IP;
    
    root /var/www/travelexplorer;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

**Enable the site:**
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/travelexplorer /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## ✅ Step 7: Test Deployment

### 7.1 Test Backend API
```bash
# From EC2 instance
curl http://localhost:3000/api/health

# From your local machine
curl http://YOUR_EC2_PUBLIC_IP:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-11-09T..."
}
```

### 7.2 Test Frontend
Open browser and navigate to:
```
http://YOUR_EC2_PUBLIC_IP
```

You should see the TravelExplorer homepage.

### 7.3 Test Full Application Flow
1. Register a new account
2. Login
3. Browse destinations
4. Create a booking
5. View dashboard
6. Test contact form

## 🔒 Step 8: Secure Your Deployment (Recommended)

### 8.1 Setup SSL with Let's Encrypt (Optional but Recommended)

**Prerequisites**: You need a domain name pointed to your EC2 IP.

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certificate will auto-renew
sudo certbot renew --dry-run
```

### 8.2 Setup Firewall (UFW)
```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS (if using SSL)

# Check status
sudo ufw status
```

### 8.3 Configure MongoDB Security
```bash
# Edit MongoDB config
sudo nano /etc/mongod.conf

# Add authentication (uncomment and modify):
security:
  authorization: enabled

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "STRONG_PASSWORD_HERE",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Restart MongoDB
sudo systemctl restart mongod
```

## 🔧 Step 9: Monitoring and Maintenance

### 9.1 View Logs
```bash
# Backend logs
pm2 logs travel-backend

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# System logs
sudo journalctl -u mongod -f
```

### 9.2 Restart Services
```bash
# Restart backend
pm2 restart travel-backend

# Restart Nginx
sudo systemctl restart nginx

# Restart MongoDB
sudo systemctl restart mongod
```

### 9.3 Update Application
```bash
# Pull latest changes (if using Git)
cd ~/Abood-project
git pull

# Update backend
cd backend
npm install
pm2 restart travel-backend

# Update frontend
cd ../frontend
sudo cp -r * /var/www/travelexplorer/
```

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs travel-backend

# Common issues:
# - MongoDB not running: sudo systemctl start mongod
# - Port 3000 in use: sudo lsof -i :3000
# - Missing .env file: cp .env.example .env
```

### Can't connect to backend from frontend
```bash
# Check if backend is running
pm2 status

# Check if port 3000 is open
curl http://localhost:3000/api/health

# Verify security group allows port 3000
# Check frontend config.js has correct IP
```

### Nginx not serving frontend
```bash
# Test Nginx config
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Verify files exist
ls -la /var/www/travelexplorer/

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### MongoDB connection failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## 📊 Performance Optimization

### Enable Nginx Caching
Edit `/etc/nginx/sites-available/travelexplorer`:
```nginx
# Add caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache my_cache;
    proxy_pass http://localhost:3000/api/;
}
```

### PM2 Cluster Mode (Multi-core)
```bash
pm2 delete travel-backend
pm2 start server.js --name travel-backend -i max
```

## 💰 Cost Optimization

### Use AWS Free Tier
- t2.micro instance: 750 hours/month free
- 30 GB EBS storage free
- 15 GB data transfer out free

### Stop Instance When Not Needed
```bash
# From AWS Console or CLI
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
```

## 📝 Automated Deployment Scripts

Use the provided scripts for easier deployment:

```bash
# Deploy backend
chmod +x deployment/deploy-backend.sh
./deployment/deploy-backend.sh

# Deploy frontend
chmod +x deployment/deploy-frontend.sh
./deployment/deploy-frontend.sh
```

## 🎯 Next Steps

1. ✅ Set up domain name with Route 53
2. ✅ Configure SSL certificate
3. ✅ Set up CloudWatch monitoring
4. ✅ Configure automated backups
5. ✅ Implement CDN with CloudFront
6. ✅ Set up CI/CD pipeline
7. ✅ Configure auto-scaling

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review AWS EC2 documentation
3. Check application logs
4. Create an issue in the repository

---

**Congratulations!** 🎉 Your TravelExplorer application is now deployed on AWS EC2!

Access your application at: `http://YOUR_EC2_PUBLIC_IP`
