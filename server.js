const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Mock user data (in production, this would be in a database)
let userProfile = {
  name: 'Rahul Sharma',
  tagline: 'Digital Creator | Designer | Developer',
  email: 'rahul.sharma@example.com',
  username: 'rahulsharma',
  joinedDate: 'January 2023',
  profilePhoto: 'https://via.placeholder.com/120x120?text=RS',
};

// API Routes

// GET /api/profile - Get user profile
app.get('/api/profile', (req, res) => {
  res.json(userProfile);
});

// PUT /api/profile - Update user profile
app.put('/api/profile', (req, res) => {
  const { name, tagline, email, username } = req.body;

  // Basic validation
  if (!name || !email || !username) {
    return res.status(400).json({ error: 'Name, email, and username are required' });
  }

  // Update profile
  userProfile = {
    ...userProfile,
    name,
    tagline: tagline || userProfile.tagline,
    email,
    username,
  };

  res.json({ message: 'Profile updated successfully', profile: userProfile });
});

// POST /api/upload - Upload profile photo
app.post('/api/upload', upload.single('profilePhoto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Update profile photo URL
  const photoUrl = `/uploads/${req.file.filename}`;
  userProfile.profilePhoto = photoUrl;

  res.json({
    message: 'Profile photo uploaded successfully',
    photoUrl: photoUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
