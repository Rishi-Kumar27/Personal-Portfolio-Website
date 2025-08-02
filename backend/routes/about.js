const express = require('express');
const { body, validationResult } = require('express-validator');
const About = require('../models/About');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get about information
// @route   GET /api/about
// @access  Public
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });
    
    if (!about) {
      return res.status(404).json({
        status: 'error',
        message: 'About information not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: about
    });
  } catch (error) {
    console.error('❌ Get about error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Create about information
// @route   POST /api/about
// @access  Private/Admin
router.post('/', protect, admin, [
  body('name').notEmpty().withMessage('Name is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('bio').notEmpty().withMessage('Bio is required'),
  body('shortBio').notEmpty().withMessage('Short bio is required'),
  body('avatar').notEmpty().withMessage('Avatar URL is required'),
  body('email').isEmail().withMessage('Please include a valid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    // Check if about info already exists
    const existingAbout = await About.findOne({ isActive: true });
    if (existingAbout) {
      return res.status(400).json({
        status: 'error',
        message: 'About information already exists. Use PUT to update.'
      });
    }

    const about = await About.create(req.body);

    res.status(201).json({
      status: 'success',
      data: about
    });
  } catch (error) {
    console.error('❌ Create about error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update about information
// @route   PUT /api/about/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('bio').optional().notEmpty().withMessage('Bio cannot be empty'),
  body('shortBio').optional().notEmpty().withMessage('Short bio cannot be empty'),
  body('avatar').optional().notEmpty().withMessage('Avatar URL cannot be empty'),
  body('email').optional().isEmail().withMessage('Please include a valid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  try {
    let about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({
        status: 'error',
        message: 'About information not found'
      });
    }

    about = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: about
    });
  } catch (error) {
    console.error('❌ Update about error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Delete about information
// @route   DELETE /api/about/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({
        status: 'error',
        message: 'About information not found'
      });
    }

    await about.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'About information deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete about error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get about summary (public info only)
// @route   GET /api/about/summary
// @access  Public
router.get('/summary/summary', async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true }).select(
      'name title shortBio avatar socialLinks experience'
    );
    
    if (!about) {
      return res.status(404).json({
        status: 'error',
        message: 'About information not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: about
    });
  } catch (error) {
    console.error('❌ Get about summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get education information
// @route   GET /api/about/education
// @access  Public
router.get('/education/education', async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true }).select('education');
    
    if (!about) {
      return res.status(404).json({
        status: 'error',
        message: 'About information not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: about.education
    });
  } catch (error) {
    console.error('❌ Get education error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

module.exports = router;