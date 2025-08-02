const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'other'],
    default: 'other'
  },
  proficiency: {
    type: Number,
    required: [true, 'Please add proficiency level'],
    min: [1, 'Proficiency must be at least 1'],
    max: [100, 'Proficiency cannot exceed 100']
  },
  icon: {
    type: String,
    default: 'fas fa-code'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
skillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Skill', skillSchema);