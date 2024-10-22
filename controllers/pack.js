// controllers/pack.js
const Package = require('../models/packege'); // Adjust based on your file structure

// Add Package
exports.addPackage = async (req, res) => {
    try {
        const { name, description, price, photos } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required.' });
        }

        const newPackage = new Package({
            name,
            description,
            price,
            photos: photos || []
        });

        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        console.error("Error adding package:", error);
        res.status(500).json({ message: 'Failed to add package.' });
    }
};

// Get All Packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ message: 'Failed to fetch packages.' });
    }
};

// Update Package
exports.updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, photos } = req.body;

        const updatedPackage = await Package.findByIdAndUpdate(
            id,
            { name, description, price, photos },
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found.' });
        }

        res.status(200).json(updatedPackage);
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ message: 'Failed to update package.' });
    }
};

// Delete Package
exports.deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPackage = await Package.findByIdAndDelete(id);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found.' });
        }

        res.status(200).json({ message: 'Package deleted successfully.' });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: 'Failed to delete package.' });
    }
};
