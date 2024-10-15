const express = require('express');
const router = express.Router();
const packageController = require('../controllers/pack'); // Adjust based on your controller file

// Add Package
router.post('/', packageController.addPackage); // Adjusted to match your API structure

// Get All Packages
router.get('/', packageController.getPackages);  // Adjusted to match your API structure

// Update Package
router.put('/:id', packageController.updatePackage); // Adjusted to match your API structure

// Delete Package
router.delete('/:id', packageController.deletePackage); // Adjusted to match your API structure

module.exports = router;
