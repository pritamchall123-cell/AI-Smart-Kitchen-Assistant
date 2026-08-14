// middleware/upload.js
// Configures Multer to handle image file uploads, temporarily storing them
// in memory (not on disk) since we only need the image briefly to send to the AI.

const multer = require("multer");

// memoryStorage keeps the uploaded file as a Buffer in RAM, accessible via req.file.buffer.
// This is ideal here — we don't need to permanently save these images anywhere,
// we just need to read the bytes long enough to send them to Gemini.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

module.exports = upload;