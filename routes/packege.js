const express = require('express');
const router = express.Router();
const packageController = require('../controllers/pack')
const multer = require('multer');



// Multer configuration
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename with timestamp
  }
});

const upload = multer({ storage: storage }); // Initialize multer with storage config


// Get all packages
router.get('/', packageController.getPackages);

// Add a new package with photos
router.post('/', upload.array('photos', 4), packageController.addPackage);

// Update a package
router.put('/:id', upload.array('photos', 4), packageController.updatePackage);

// Delete a package
router.delete('/:id', packageController.deletePackage);

module.exports = router;
