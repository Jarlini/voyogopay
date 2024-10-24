const Package = require('../models/packege');

// Get all packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error });
  }
};

// Add a new package
exports.addPackage = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const photos = req.files ? req.files.map(file => file.path) : [];

    const newPackage = new Package({
      name,
      description,
      price,
      photos
    });

    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error adding package', error });
  }
};

// Update a package
exports.updatePackage = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const photos = req.files ? req.files.map(file => file.path) : [];

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      { name, description, price, photos },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating package', error });
  }
};

// Delete a package
exports.deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error });
  }
};
