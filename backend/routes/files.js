const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads (if needed for admin functionality)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/files/'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname;
    cb(null, `${timestamp}-${originalName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// Ensure public/files directory exists
const ensureFilesDirectory = async () => {
  const filesDir = path.join(__dirname, '../public/files');
  try {
    await fs.access(filesDir);
  } catch (error) {
    await fs.mkdir(filesDir, { recursive: true });
    console.log('Created files directory:', filesDir);
  }
};

// GET /api/files/resume - Download resume/CV
router.get('/resume', async (req, res) => {
  try {
    const filesDir = path.join(__dirname, '../public/files');
    const files = await fs.readdir(filesDir);
    
    // Look for resume files (common naming patterns)
    const resumePatterns = [
      /^resume\./i,
      /^cv\./i,
      /^curriculum.*vitae/i,
      /.*resume.*/i,
      /.*cv.*/i
    ];
    
    let resumeFile = null;
    
    for (const file of files) {
      if (resumePatterns.some(pattern => pattern.test(file))) {
        resumeFile = file;
        break;
      }
    }
    
    if (!resumeFile) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found'
      });
    }
    
    const filePath = path.join(filesDir, resumeFile);
    const stat = await fs.stat(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeFile}"`);
    res.setHeader('Content-Length', stat.size);
    
    // Stream the file
    const fileStream = require('fs').createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving resume file'
    });
  }
});

// GET /api/files/list - Get list of available files
router.get('/list', async (req, res) => {
  try {
    const filesDir = path.join(__dirname, '../public/files');
    const files = await fs.readdir(filesDir);
    
    const fileList = [];
    
    for (const file of files) {
      const filePath = path.join(filesDir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isFile()) {
        const fileInfo = {
          name: file,
          size: stat.size,
          lastModified: stat.mtime,
          downloadUrl: `/api/files/download/${encodeURIComponent(file)}`
        };
        
        // Categorize files
        if (/\.(pdf|doc|docx)$/i.test(file)) {
          fileInfo.category = 'document';
        } else if (/\.(jpg|jpeg|png|gif|svg)$/i.test(file)) {
          fileInfo.category = 'image';
        } else {
          fileInfo.category = 'other';
        }
        
        fileList.push(fileInfo);
      }
    }
    
    res.json({
      success: true,
      data: fileList,
      total: fileList.length
    });
    
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing files'
    });
  }
});

// GET /api/files/download/:filename - Download specific file
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    
    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    const filePath = path.join(__dirname, '../public/files', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    const stat = await fs.stat(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stat.size);
    
    // Stream the file
    const fileStream = require('fs').createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving file'
    });
  }
});

// POST /api/files/upload - Upload file (admin only - add authentication as needed)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        downloadUrl: `/api/files/download/${encodeURIComponent(req.file.filename)}`
      }
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

// DELETE /api/files/:filename - Delete file (admin only - add authentication as needed)
router.delete('/:filename', async (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    
    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }
    
    const filePath = path.join(__dirname, '../public/files', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Delete the file
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
});

// Initialize files directory on module load
ensureFilesDirectory();

module.exports = router;