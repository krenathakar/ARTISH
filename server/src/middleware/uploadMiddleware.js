const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

function checkFileType(file, cb) {
  const extname = /\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|mov|m4v|avi|mkv|ogv|3gp)$/i.test(file.originalname);
  const mimetype = /^(image|video)\//.test(file.mimetype) || file.mimetype === 'application/octet-stream';
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images and video files only!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max for images and video clips
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
