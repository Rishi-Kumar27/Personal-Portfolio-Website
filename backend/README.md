# Portfolio Backend API

A robust Node.js/Express backend API for managing portfolio data including projects, skills, contact form submissions, and personal information.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with admin roles
- **Project Management**: CRUD operations for portfolio projects
- **Skills Management**: Technical skills with proficiency levels and categories
- **Contact Form**: Email notifications for contact submissions
- **About Information**: Personal bio, education, and social links
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: MongoDB with Mongoose ODM
- **Email Integration**: Nodemailer for contact form notifications

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🗄️ Database Setup

1. **Install MongoDB** (if using locally)
2. **Run the seeder** to populate with sample data:
   ```bash
   node utils/seeder.js
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)
- `PUT /api/auth/updatedetails` - Update user details (protected)
- `PUT /api/auth/updatepassword` - Update password (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/category/:category` - Get projects by category

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create skill (admin only)
- `PUT /api/skills/:id` - Update skill (admin only)
- `DELETE /api/skills/:id` - Delete skill (admin only)
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/summary` - Get skills summary

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin only)
- `GET /api/contact/:id` - Get single submission (admin only)
- `PUT /api/contact/:id` - Update submission status (admin only)
- `DELETE /api/contact/:id` - Delete submission (admin only)
- `GET /api/contact/stats` - Get contact statistics (admin only)

### About
- `GET /api/about` - Get about information
- `POST /api/about` - Create about info (admin only)
- `PUT /api/about/:id` - Update about info (admin only)
- `DELETE /api/about/:id` - Delete about info (admin only)
- `GET /api/about/summary` - Get about summary
- `GET /api/about/education` - Get education info

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📝 Sample API Requests

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Create Project (Admin)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "My New Project",
    "description": "Project description",
    "shortDescription": "Short description",
    "image": "https://example.com/image.jpg",
    "technologies": ["React", "Node.js"],
    "category": "web"
  }'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "Your portfolio looks great!"
  }'
```

## 🧪 Testing

Run tests with Jest:
```bash
npm test
```

## 📦 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `node utils/seeder.js` - Import sample data
- `node utils/seeder.js -d` - Delete all data

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/portfolio |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | 24h |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | Email username | Required |
| `EMAIL_PASS` | Email password | Required |

## 🚀 Deployment

### Heroku
1. Create a new Heroku app
2. Add MongoDB addon
3. Set environment variables
4. Deploy with Git

### Vercel
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker
```bash
# Build image
docker build -t portfolio-backend .

# Run container
docker run -p 5000:5000 portfolio-backend
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── User.js             # User model
│   ├── Project.js          # Project model
│   ├── Skill.js            # Skill model
│   ├── Contact.js          # Contact model
│   └── About.js            # About model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── projects.js         # Project routes
│   ├── skills.js           # Skill routes
│   ├── contact.js          # Contact routes
│   └── about.js            # About routes
├── utils/
│   ├── sendEmail.js        # Email utility
│   └── seeder.js           # Database seeder
├── server.js               # Main server file
├── package.json            # Dependencies
└── README.md               # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.