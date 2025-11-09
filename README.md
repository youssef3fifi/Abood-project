# TravelExplorer - Full-Stack Travel Booking System

A professional full-stack travel booking system with modern UI, secure authentication, and AWS EC2 deployment support.

## 🌟 Features

### Frontend
- **5 Complete Pages**: Home, Destinations, Booking, Dashboard, Contact
- Modern, responsive UI design with smooth animations
- Mobile-friendly interface
- User authentication (login/register)
- Real-time booking management
- Interactive package filtering and sorting
- Professional styling with CSS variables

### Backend
- RESTful API architecture with Express.js
- **In-Memory Storage** - No database installation required! Perfect for quick setup and testing
- Pre-loaded with 6 sample travel packages
- JWT-based authentication
- Secure password hashing with bcryptjs
- Input validation and error handling
- CORS configuration for cross-origin requests
- AWS EC2 deployment ready (binds to 0.0.0.0)

### Key Functionalities
- Browse travel packages with advanced filtering
- Secure user registration and authentication
- Book travel packages with date selection
- Manage bookings from dashboard
- View, update, and cancel bookings
- Contact form for customer support
- Responsive design for all devices

## 📁 Project Structure

```
/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── bookingController.js  # Booking management
│   │   └── packageController.js  # Package management
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Package.js            # Package schema
│   │   └── Booking.js            # Booking schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── bookings.js           # Booking routes
│   │   ├── contact.js            # Contact routes
│   │   └── packages.js           # Package routes
│   ├── utils/
│   │   └── idGenerator.js        # ID generation utility
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Main server file
├── frontend/
│   ├── css/
│   │   ├── style.css             # Main styles
│   │   └── responsive.css        # Responsive styles
│   ├── js/
│   │   ├── api.js                # API utility functions
│   │   ├── auth.js               # Auth utilities
│   │   ├── config.js             # API configuration
│   │   ├── config.example.js     # Config template
│   │   └── main.js               # Common utilities
│   ├── index.html                # Home page
│   ├── destinations.html         # Packages listing
│   ├── booking.html              # Booking form
│   ├── dashboard.html            # User dashboard
│   └── contact.html              # Contact page
├── deployment/
│   ├── deploy-backend.sh         # Backend deployment script
│   ├── deploy-frontend.sh        # Frontend deployment script
│   └── nginx.conf.example        # Nginx configuration
├── .gitignore
├── README.md
└── AWS-DEPLOYMENT.md             # Detailed AWS guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

**Note**: MongoDB is NOT required! This version uses in-memory storage for quick setup.

### Local Development Setup (2 Minutes!)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Abood-project
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file (optional - has defaults)
   cp .env.example .env
   
   # Start server - that's it!
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   
   The server will automatically:
   - Start with in-memory storage
   - Load 6 sample travel packages
   - Be ready to accept requests immediately!
   
   **Note**: All data is stored in memory and will be reset when the server restarts.

3. **Setup Frontend**
   ```bash
   cd frontend
   
   # Copy config file
   cp js/config.example.js js/config.js
   
   # Edit js/config.js to set API endpoint
   # For local: http://localhost:3000/api
   
   # Serve frontend (using any static server)
   # Option 1: Using Python
   python -m http.server 8080
   
   # Option 2: Using Node's http-server
   npx http-server -p 8080
   
   # Option 3: Using VS Code Live Server extension
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api
   - API Health Check: http://localhost:3000/api/health

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory (optional - the server will work with defaults):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS (for AWS EC2)
FRONTEND_URL=*
```

**Note**: MongoDB is not required. This version uses in-memory storage by default.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Packages
- `GET /api/packages` - Get all packages (with filters)
- `GET /api/packages/:id` - Get single package
- `POST /api/packages` - Create package (protected)
- `PUT /api/packages/:id` - Update package (protected)
- `DELETE /api/packages/:id` - Delete package (protected)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

### Contact
- `POST /api/contact` - Submit contact form

## 🌐 AWS EC2 Deployment

For detailed AWS deployment instructions, see [AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md)

### Quick Deploy

1. **Launch EC2 instance** (Ubuntu 20.04 or later)

2. **Configure Security Group**
   - HTTP (80): 0.0.0.0/0
   - Custom TCP (3000): 0.0.0.0/0
   - SSH (22): Your IP

3. **Deploy Backend**
   ```bash
   # SSH into EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Upload and run deployment script
   chmod +x deployment/deploy-backend.sh
   ./deployment/deploy-backend.sh
   ```

4. **Deploy Frontend**
   ```bash
   # Update frontend config with EC2 IP
   chmod +x deployment/deploy-frontend.sh
   ./deployment/deploy-frontend.sh
   ```

5. **Access your application**
   - Frontend: http://your-ec2-ip
   - Backend: http://your-ec2-ip:3000/api

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **In-Memory Storage** - No database required for quick setup!
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **dotenv** - Environment variables
- **Express Rate Limit** - API rate limiting for security

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern features
- **JavaScript (ES6+)** - Functionality
- **Fetch API** - HTTP requests

### Deployment
- **PM2** - Process manager
- **Nginx** - Web server / reverse proxy
- **AWS EC2** - Cloud hosting

## 📝 Usage

### For Users
1. **Register** - Create an account
2. **Browse Packages** - Explore destinations
3. **Book Trip** - Select dates and travelers
4. **Manage Bookings** - View, update, or cancel from dashboard

### For Developers
1. Review API documentation
2. Extend models as needed
3. Add new routes/controllers
4. Customize frontend pages
5. Deploy to production

## 🔧 Configuration

### Frontend API Endpoint
Edit `frontend/js/config.js`:
```javascript
const CONFIG = {
  API_BASE_URL: 'http://your-ec2-ip:3000/api'
};
```

### Backend CORS
Edit `backend/.env`:
```env
FRONTEND_URL=http://your-frontend-url
# or use * for all origins (development only)
```

## 🐛 Troubleshooting

### Backend won't start
- Verify Node.js is installed: `node --version`
- Check port 3000 isn't already in use: `lsof -i :3000`
- Ensure all dependencies are installed: `npm install`

### Frontend can't connect to backend
- Verify backend is running: `curl http://localhost:3000/api/health`
- Check `frontend/js/config.js` has correct API URL
- Ensure CORS is configured properly in backend
- Check EC2 security group allows port 3000 (if on AWS)

### Data is lost after server restart
- This is expected behavior with in-memory storage
- Data is stored in RAM and resets when the server stops
- For persistent storage, consider implementing a database solution

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For questions or issues:
- Create an issue in the repository
- Contact: info@travelexplorer.com

## 🎯 Future Enhancements

- Payment gateway integration
- Email notifications
- Advanced search and recommendations
- User reviews and ratings
- Multi-language support
- Admin panel for package management
- Real-time availability tracking
- Social media integration

---

Built with ❤️ for travelers worldwide