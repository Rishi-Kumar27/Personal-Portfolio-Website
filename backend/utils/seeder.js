const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const About = require('../models/About');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Rishi Kumar',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true
  }
];

const sampleProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard.',
    shortDescription: 'Full-stack e-commerce platform with payment integration',
    image: 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=E-Commerce',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    category: 'web',
    featured: true,
    order: 1
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    shortDescription: 'Real-time collaborative task management app',
    image: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Task+App',
    technologies: ['Vue.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    githubUrl: 'https://github.com/example/task-app',
    liveUrl: 'https://task-app-demo.com',
    category: 'web',
    featured: true,
    order: 2
  },
  {
    title: 'Weather Dashboard',
    description: 'A weather dashboard that displays current weather conditions and forecasts using multiple weather APIs and interactive charts.',
    shortDescription: 'Interactive weather dashboard with real-time data',
    image: 'https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Weather',
    technologies: ['JavaScript', 'Chart.js', 'Weather API', 'CSS3'],
    githubUrl: 'https://github.com/example/weather-app',
    liveUrl: 'https://weather-dashboard.com',
    category: 'web',
    featured: false,
    order: 3
  }
];

const sampleSkills = [
  // Frontend
  { name: 'HTML5', category: 'frontend', proficiency: 95, icon: 'fab fa-html5', color: '#E34F26', order: 1 },
  { name: 'CSS3', category: 'frontend', proficiency: 90, icon: 'fab fa-css3-alt', color: '#1572B6', order: 2 },
  { name: 'JavaScript', category: 'frontend', proficiency: 88, icon: 'fab fa-js-square', color: '#F7DF1E', order: 3 },
  { name: 'React', category: 'frontend', proficiency: 85, icon: 'fab fa-react', color: '#61DAFB', order: 4 },
  { name: 'Vue.js', category: 'frontend', proficiency: 80, icon: 'fab fa-vuejs', color: '#4FC08D', order: 5 },
  { name: 'Tailwind CSS', category: 'frontend', proficiency: 85, icon: 'fas fa-palette', color: '#06B6D4', order: 6 },
  
  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 88, icon: 'fab fa-node-js', color: '#339933', order: 7 },
  { name: 'Express.js', category: 'backend', proficiency: 85, icon: 'fas fa-server', color: '#000000', order: 8 },
  { name: 'Python', category: 'backend', proficiency: 82, icon: 'fab fa-python', color: '#3776AB', order: 9 },
  { name: 'Django', category: 'backend', proficiency: 78, icon: 'fab fa-python', color: '#092E20', order: 10 },
  
  // Database
  { name: 'MongoDB', category: 'database', proficiency: 85, icon: 'fas fa-database', color: '#47A248', order: 11 },
  { name: 'PostgreSQL', category: 'database', proficiency: 80, icon: 'fas fa-database', color: '#336791', order: 12 },
  { name: 'Redis', category: 'database', proficiency: 75, icon: 'fas fa-memory', color: '#DC382D', order: 13 },
  
  // DevOps
  { name: 'Docker', category: 'devops', proficiency: 78, icon: 'fab fa-docker', color: '#2496ED', order: 14 },
  { name: 'Git', category: 'devops', proficiency: 90, icon: 'fab fa-git-alt', color: '#F05032', order: 15 },
  { name: 'AWS', category: 'devops', proficiency: 72, icon: 'fab fa-aws', color: '#FF9900', order: 16 },
  
  // Tools
  { name: 'VS Code', category: 'tools', proficiency: 95, icon: 'fas fa-code', color: '#007ACC', order: 17 },
  { name: 'Figma', category: 'tools', proficiency: 80, icon: 'fab fa-figma', color: '#F24E1E', order: 18 },
  { name: 'Postman', category: 'tools', proficiency: 85, icon: 'fas fa-paper-plane', color: '#FF6C37', order: 19 }
];

const sampleAbout = {
  name: 'Rishi Kumar',
  title: 'Full Stack Developer & UI/UX Designer',
  bio: 'I am a passionate Full Stack Developer with expertise in modern web technologies. I love creating beautiful, functional, and user-friendly applications that solve real-world problems. With a strong foundation in both frontend and backend development, I enjoy working on projects that challenge me to learn and grow.',
  shortBio: 'Passionate Full Stack Developer creating beautiful and functional web applications.',
  avatar: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=RK',
  email: 'rishi@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  socialLinks: {
    github: 'https://github.com/rishikumar',
    linkedin: 'https://linkedin.com/in/rishikumar',
    twitter: 'https://twitter.com/rishikumar',
    portfolio: 'https://rishikumar.dev'
  },
  experience: 5,
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      year: 2020,
      description: 'Graduated with honors, specialized in Software Engineering'
    },
    {
      degree: 'Master of Science in Information Technology',
      institution: 'Stanford University',
      year: 2022,
      description: 'Focus on Web Technologies and User Experience Design'
    }
  ]
};

// Import data into database
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Skill.deleteMany();
    await About.deleteMany();

    // Import users
    const createdUsers = await User.create(sampleUsers);
    console.log('✅ Users imported');

    // Import projects
    await Project.create(sampleProjects);
    console.log('✅ Projects imported');

    // Import skills
    await Skill.create(sampleSkills);
    console.log('✅ Skills imported');

    // Import about
    await About.create(sampleAbout);
    console.log('✅ About information imported');

    console.log('🎉 Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Project.deleteMany();
    await Skill.deleteMany();
    await About.deleteMany();

    console.log('🗑️ Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

// Run seeder based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}