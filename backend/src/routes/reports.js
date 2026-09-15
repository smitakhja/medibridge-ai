const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadReport, getReports, getReport } = require('../controllers/reportsController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, JPG, and PNG files are allowed.'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);
router.post('/upload', upload.single('report'), uploadReport);
router.get('/', getReports);
router.get('/:id', getReport);

module.exports = router;
