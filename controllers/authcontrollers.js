const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password, role });

    // Hash password before saving it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user in the database
    await user.save();

    // Create payload for JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    // Sign the token and return it
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Registered successfully', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create payload for JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    // Sign the token and return it
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Assuming User is your model
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch user by ID (protected route)
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user role
    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).send('Error updating user role');
  }
};

// Fetch users by group 1
exports.getGroup1Users = async (req, res) => {
  try {
    const users = await User.find({ group: 'group1' });
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching group 1 users');
  }
};

// Fetch users by group 2
exports.getGroup2Users = async (req, res) => {
  try {
    const users = await User.find({ group: 'group2' });
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching group 2 users');
  }
};

// Fetch users by group 3
exports.getGroup3Users = async (req, res) => {
  try {
    const users = await User.find({ group: 'group3' });
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching group 3 users');
  }
};
