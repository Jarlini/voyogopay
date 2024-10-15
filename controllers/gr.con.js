// controllers/groupController.js
const Group = require('../models/gr');

// Get all groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get group by ID
exports.getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Add a new group
exports.addGroup = async (req, res) => {
  const { name, members } = req.body;

  try {
    const newGroup = new Group({ name, members });
    await newGroup.save();
    res.json({ message: 'Group added successfully', group: newGroup });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a group
exports.updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, members } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.name = name || group.name;
    group.members = members || group.members;

    await group.save();
    res.json({ message: 'Group updated successfully', group });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    await Group.findByIdAndDelete(id);
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Add a member to a group
exports.addMemberToGroup = async (req, res) => {
  const { id } = req.params;
  const { memberId } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members.push(memberId);
    await group.save();

    res.json({ message: 'Member added successfully', group });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Remove a member from a group
exports.removeMemberFromGroup = async (req, res) => {
  const { id } = req.params;
  const { memberId } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members = group.members.filter(member => member.toString() !== memberId);
    await group.save();

    res.json({ message: 'Member removed successfully', group });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
