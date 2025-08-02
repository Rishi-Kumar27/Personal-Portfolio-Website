const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Sample projects data (in a real app, this would come from a database)
const sampleProjects = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "A full-stack e-commerce solution with payment integration, user authentication, and admin panel.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
    image: "/images/projects/ecommerce.jpg",
    liveUrl: "https://example-ecommerce.com",
    githubUrl: "https://github.com/username/ecommerce-project",
    featured: true,
    category: "web",
    createdAt: "2023-10-15"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team collaboration features.",
    technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
    image: "/images/projects/taskmanager.jpg",
    liveUrl: "https://example-taskmanager.com",
    githubUrl: "https://github.com/username/task-manager",
    featured: true,
    category: "web",
    createdAt: "2023-09-20"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A responsive weather dashboard with location-based forecasts and interactive charts.",
    technologies: ["JavaScript", "Chart.js", "OpenWeather API", "CSS3"],
    image: "/images/projects/weather.jpg",
    liveUrl: "https://example-weather.com",
    githubUrl: "https://github.com/username/weather-dashboard",
    featured: false,
    category: "web",
    createdAt: "2023-08-10"
  },
  {
    id: 4,
    title: "Mobile Fitness App",
    description: "A React Native fitness tracking app with workout plans and progress tracking.",
    technologies: ["React Native", "Redux", "Firebase", "Expo"],
    image: "/images/projects/fitness.jpg",
    liveUrl: null,
    githubUrl: "https://github.com/username/fitness-app",
    featured: false,
    category: "mobile",
    createdAt: "2023-07-05"
  }
];

// Load projects from file
const getProjectsData = async () => {
  try {
    const dataPath = path.join(__dirname, '../data/projects.json');
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return sample data
    console.log('Using sample projects data');
    return sampleProjects;
  }
};

// Save projects to file
const saveProjectsData = async (projects) => {
  try {
    const dataDir = path.join(__dirname, '../data');
    const dataPath = path.join(dataDir, 'projects.json');
    
    // Create data directory if it doesn't exist
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(dataPath, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error saving projects data:', error);
  }
};

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await getProjectsData();
    const { category, featured, limit } = req.query;
    
    let filteredProjects = [...projects];
    
    // Filter by category
    if (category) {
      filteredProjects = filteredProjects.filter(project => 
        project.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by featured status
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      filteredProjects = filteredProjects.filter(project => 
        project.featured === isFeatured
      );
    }
    
    // Sort by creation date (newest first)
    filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Limit results
    if (limit) {
      const limitNum = parseInt(limit);
      filteredProjects = filteredProjects.slice(0, limitNum);
    }
    
    res.json({
      success: true,
      data: filteredProjects,
      total: filteredProjects.length
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const projects = await getProjectsData();
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
    
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
});

// GET /api/projects/categories - Get all project categories
router.get('/meta/categories', async (req, res) => {
  try {
    const projects = await getProjectsData();
    const categories = [...new Set(projects.map(project => project.category))];
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// GET /api/projects/technologies - Get all technologies used
router.get('/meta/technologies', async (req, res) => {
  try {
    const projects = await getProjectsData();
    const allTechnologies = projects.flatMap(project => project.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)].sort();
    
    res.json({
      success: true,
      data: uniqueTechnologies
    });
    
  } catch (error) {
    console.error('Error fetching technologies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching technologies'
    });
  }
});

// Initialize projects data file with sample data
const initializeProjectsData = async () => {
  try {
    const dataPath = path.join(__dirname, '../data/projects.json');
    await fs.access(dataPath);
  } catch (error) {
    // File doesn't exist, create it with sample data
    console.log('Initializing projects data file...');
    await saveProjectsData(sampleProjects);
  }
};

// Initialize on module load
initializeProjectsData();

module.exports = router;