# Portfolio Backend API

A robust Node.js/Express backend for portfolio websites with contact form handling, project management, and file serving capabilities.

## 🚀 Features

- **Contact Form API**: Secure contact form with email notifications and auto-replies
- **Projects API**: Dynamic project data management with filtering and categorization
- **File Serving**: Resume/CV download and file management system
- **Security**: Rate limiting, input validation, CORS protection, and security headers
- **Email Integration**: Support for Gmail and custom SMTP servers
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (>= 16.0.0)
- npm or yarn package manager
- Email service (Gmail recommended) for contact form functionality

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd <your-repo>/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   - Set up email credentials (Gmail recommended)
   - Configure frontend URL
   - Set port if needed

4. **Create necessary directories**:
   ```bash
   mkdir -p public/files data
   ```

## ⚙️ Configuration

### Email Setup (Gmail - Recommended)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → App passwords
   - Generate password for "Mail"
3. Update `.env` file:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_password_here
   EMAIL_FROM=your.email@gmail.com
   EMAIL_TO=your.email@gmail.com
   ```

### Custom SMTP Setup

For other email providers, update `.env`:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@your-provider.com
SMTP_PASS=your_password_here
```

## 🏃‍♂️ Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Documentation

### Health Check
- **GET** `/api/health` - Check server status

### Contact Form
- **POST** `/api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "Hello, I'd like to discuss..."
  }
  ```
- **GET** `/api/contact/test` - Test email configuration (development only)

### Projects
- **GET** `/api/projects` - Get all projects
  - Query parameters:
    - `category` - Filter by category (web, mobile, etc.)
    - `featured` - Filter by featured status (true/false)
    - `limit` - Limit number of results
- **GET** `/api/projects/:id` - Get specific project
- **GET** `/api/projects/meta/categories` - Get all categories
- **GET** `/api/projects/meta/technologies` - Get all technologies

### Files
- **GET** `/api/files/resume` - Download resume/CV
- **GET** `/api/files/list` - List all available files
- **GET** `/api/files/download/:filename` - Download specific file
- **POST** `/api/files/upload` - Upload file (admin only)
- **DELETE** `/api/files/:filename` - Delete file (admin only)

## 📁 Project Structure

```
backend/
├── routes/
│   ├── contact.js          # Contact form endpoints
│   ├── projects.js         # Project management endpoints
│   └── files.js           # File serving endpoints
├── data/
│   └── projects.json      # Project data storage
├── public/
│   └── files/            # Uploaded files storage
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
├── server.js           # Main server file
└── README.md          # This file
```

## 🔧 Customization

### Adding Projects

1. **Manual**: Edit `backend/data/projects.json`
2. **API**: Use the projects endpoints (add authentication for production)

### Email Templates

Customize email templates in `routes/contact.js`:
- Owner notification email
- Auto-reply email to sender

### File Upload Settings

Modify file upload settings in `routes/files.js`:
- File size limits
- Allowed file types
- Storage location

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes, 5 contact form submissions per hour
- **Input Validation**: Comprehensive validation for all form inputs
- **CORS Protection**: Configurable CORS settings
- **Security Headers**: Helmet.js for security headers
- **File Upload Security**: Type validation and secure storage

## 🚀 Production Deployment

1. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-portfolio-domain.com
   ```

2. **Process Manager** (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "portfolio-backend"
   ```

3. **Reverse Proxy** (Nginx recommended):
   ```nginx
   location /api {
       proxy_pass http://localhost:5000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
   }
   ```

## 🧪 Testing

Test the email configuration:
```bash
curl http://localhost:5000/api/contact/test
```

Test the API endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Get projects
curl http://localhost:5000/api/projects

# Submit contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message."
  }'
```

## 🐛 Troubleshooting

### Email Issues
- Verify Gmail App Password is correct
- Check if 2FA is enabled on Gmail
- Ensure email credentials are properly set in `.env`

### File Upload Issues
- Check if `public/files` directory exists and is writable
- Verify file size and type restrictions

### CORS Issues
- Ensure `FRONTEND_URL` matches your frontend domain
- Check browser console for CORS errors

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request