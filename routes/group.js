app.post('/api/groups', async (req, res) => {
    const { email } = req.body;
    
    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }
    
    // Check if group already exists
    const existingGroup = await Group.findOne({ adminEmail: email });
    if (existingGroup) {
        return res.status(400).json({ message: "Group already exists" });
    }
    
    // Create new group
    const newGroup = new Group({ adminEmail: email, groupName: `Group for ${email}` });
    await newGroup.save();
    
    res.status(201).json(newGroup);
});
