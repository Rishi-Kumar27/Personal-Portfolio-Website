# Portfolio Website

A modern, responsive portfolio website with a dynamic backend API for managing content.

## 📁 Project Structure

```
├── Portfolio/          # Frontend (HTML, CSS, JavaScript)
│   ├── index.html     # Main portfolio page
│   ├── script.js      # Frontend JavaScript
│   ├── style.css      # Custom styles
│   ├── output.css     # Tailwind CSS output
│   └── images/        # Portfolio images
├── backend/           # Backend API (Node.js/Express)
│   ├── server.js      # Main server file
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   ├── middleware/    # Custom middleware
│   └── utils/         # Utility functions
└── README.md          # This file
```

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional design with smooth animations
- **Interactive Elements**: Dynamic content loading and user interactions
- **SEO Optimized**: Meta tags and semantic HTML structure

### Backend
- **RESTful API**: Complete CRUD operations for portfolio content
- **Authentication**: JWT-based authentication with admin roles
- **Database**: MongoDB with Mongoose ODM
- **Email Integration**: Contact form with email notifications
- **Security**: Rate limiting, CORS, input validation
- **File Upload**: Image upload support for projects

## 🛠️ Quick Start

### Frontend Setup
```bash
cd Portfolio
# Open index.html in your browser or serve with a local server
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

## 📚 API Documentation

The backend provides a comprehensive API for managing portfolio content:

- **Authentication**: `/api/auth/*`
- **Projects**: `/api/projects/*`
- **Skills**: `/api/skills/*`
- **Contact**: `/api/contact/*`
- **About**: `/api/about/*`

For detailed API documentation, see [backend/README.md](backend/README.md).

## 🔧 Technologies Used

### Frontend
- HTML5
- CSS3 (Tailwind CSS)
- Vanilla JavaScript
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer
- Express Validator

## 📱 Responsive Design

The portfolio is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Customization

### Frontend
- Update content in `index.html`
- Modify styles in `style.css`
- Add animations in `script.js`
- Replace images in `images/` folder

### Backend
- Configure environment variables in `.env`
- Update database models in `models/`
- Modify API routes in `routes/`
- Add new features in `utils/`

## 🚀 Deployment

### Frontend
- Deploy to any static hosting service (Netlify, Vercel, GitHub Pages)
- Or serve from any web server

### Backend
- Deploy to Heroku, Vercel, or any Node.js hosting platform
- Set up MongoDB database (MongoDB Atlas recommended)
- Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation in each folder
- Review the API documentation in `backend/README.md`


