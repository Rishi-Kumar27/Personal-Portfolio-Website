const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      status: 'success',
      count: projects.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: projects
    });
  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
router.post('/', protect, admin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('technologies').isArray({ min: 1 }).withMessage('At least one technology is required'),
  body('category').isIn(['web', 'mobile', 'desktop', 'other']).withMessage('Invalid category')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    console.error('❌ Create project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional().notEmpty().withMessage('Short description cannot be empty'),
  body('image').optional().notEmpty().withMessage('Image URL cannot be empty'),
  body('technologies').optional().isArray({ min: 1 }).withMessage('At least one technology is required'),
  body('category').optional().isIn(['web', 'mobile', 'desktop', 'other']).withMessage('Invalid category')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
router.get('/featured/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      status: 'success',
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('❌ Get featured projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const projects = await Project.find({ 
      category, 
      isActive: true 
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Project.countDocuments({ category, isActive: true });

    res.status(200).json({
      status: 'success',
      count: projects.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: projects
    });
  } catch (error) {
    console.error('❌ Get projects by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;