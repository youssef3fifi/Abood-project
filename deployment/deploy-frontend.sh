#!/bin/bash

# Frontend Deployment Script for AWS EC2
# This script sets up and deploys the frontend on an EC2 instance

echo "======================================"
echo "TravelExplorer Frontend Deployment"
echo "======================================"

# Install Nginx (if not already installed)
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Prompt for EC2 IP address
echo ""
echo "Enter your EC2 instance public IP address (e.g., 54.123.45.67):"
read -r ec2_ip

if [ -z "$ec2_ip" ]; then
    echo "Error: IP address is required"
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Update config.js with EC2 IP
echo "Updating API configuration..."
cat > js/config.js << EOF
// API Configuration
const CONFIG = {
  API_BASE_URL: 'http://${ec2_ip}:3000/api'
};
EOF

echo "API endpoint configured to: http://${ec2_ip}:3000/api"

# Copy frontend files to Nginx web root
echo "Deploying frontend files..."
sudo mkdir -p /var/www/travelexplorer
sudo cp -r * /var/www/travelexplorer/
sudo chown -R www-data:www-data /var/www/travelexplorer
sudo chmod -R 755 /var/www/travelexplorer

# Create Nginx configuration
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/travelexplorer > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name ${ec2_ip} _;
    
    root /var/www/travelexplorer;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/travelexplorer /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Restart Nginx
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo ""
    echo "======================================"
    echo "✅ Frontend deployment completed!"
    echo "======================================"
    echo ""
    echo "Frontend is accessible at: http://${ec2_ip}"
    echo "Backend API is at: http://${ec2_ip}:3000/api"
    echo ""
    echo "⚠️  Make sure your EC2 security group allows:"
    echo "   - Inbound HTTP traffic on port 80"
    echo "   - Inbound traffic on port 3000 for API"
    echo ""
else
    echo "Error: Nginx configuration test failed"
    exit 1
fi
