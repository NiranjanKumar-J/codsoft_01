const multer = require('multer');

// ❌ OLD WAY: diskStorage (Vercel-la work aagadhu because read-only)
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
*/

// ✅ NEW WAY: memoryStorage (Idhu Vercel-la work aagum)
// File-ai folder-la podama, temporary-ah RAM-la vechukkum.
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = upload;