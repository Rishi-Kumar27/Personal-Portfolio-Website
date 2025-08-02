const express = require('express');
const { body, validationResult } = require('express-validator');
const Skill = require('../models/Skill');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category) query.category = category;
    
    const skills = await Skill.find(query)
      .sort({ order: 1, proficiency: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error('❌ Get skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const skills = await Skill.find({ 
      category, 
      isActive: true 
    }).sort({ order: 1, proficiency: -1 });

    res.status(200).json({
      status: 'success',
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error('❌ Get skills by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: skill
    });
  } catch (error) {
    console.error('❌ Get skill error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Admin
router.post('/', protect, admin, [
  body('name').notEmpty().withMessage('Skill name is required'),
  body('category').isIn(['frontend', 'backend', 'database', 'devops', 'tools', 'other']).withMessage('Invalid category'),
  body('proficiency').isInt({ min: 1, max: 100 }).withMessage('Proficiency must be between 1 and 100')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      status: 'success',
      data: skill
    });
  } catch (error) {
    console.error('❌ Create skill error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('name').optional().notEmpty().withMessage('Skill name cannot be empty'),
  body('category').optional().isIn(['frontend', 'backend', 'database', 'devops', 'tools', 'other']).withMessage('Invalid category'),
  body('proficiency').optional().isInt({ min: 1, max: 100 }).withMessage('Proficiency must be between 1 and 100')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: skill
    });
  } catch (error) {
    console.error('❌ Update skill error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete skill error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get skills summary (for dashboard)
// @route   GET /api/skills/summary
// @access  Public
router.get('/summary/summary', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({ proficiency: -1 });
    
    // Group by category
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    // Calculate average proficiency by category
    const categoryStats = Object.keys(skillsByCategory).map(category => {
      const categorySkills = skillsByCategory[category];
      const avgProficiency = categorySkills.reduce((sum, skill) => sum + skill.proficiency, 0) / categorySkills.length;
      
      return {
        category,
        count: categorySkills.length,
        averageProficiency: Math.round(avgProficiency),
        skills: categorySkills
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalSkills: skills.length,
        categories: categoryStats,
        topSkills: skills.slice(0, 10) // Top 10 skills by proficiency
      }
    });
  } catch (error) {
    console.error('❌ Get skills summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;