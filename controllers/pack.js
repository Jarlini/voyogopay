const Package = require('../models/packege');

// Add a new package
exports.addPackage = async (req, res) => {
  try {
      const { name, description, price } = req.body; // Extract data from request
      const newPackage = new Package({ name, description, price }); // Create new package instance
      await newPackage.save(); // Save to database
      res.status(201).json(newPackage); // Respond with the created package
  } catch (error) {
      console.error('Error adding package:', error);
      res.status(500).json({ error: 'Failed to add package' });
  }
};

exports.getPackages = async (req, res) => {
  console.log('Fetching packages...');
  try {
      const packages = await Package.find(); // or however you're querying the database
      console.log('Packages fetched:', packages);
      res.status(200).json(packages);
  } catch (error) {
      console.error('Error fetching packages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Update a package
exports.updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const updatedPackage = await Package.findByIdAndUpdate(
            id,
            { name, description, price },
            { new: true }
        );
        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(500).json({ message: 'Error updating package', error });
    }
};

// Delete a package
exports.deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        await Package.findByIdAndDelete(id);
        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting package', error });
    }
};
