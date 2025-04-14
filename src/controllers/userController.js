const userModel = require("../models/userModel");

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    let usersList;
    if (role) {
      usersList = await userModel.find({ role: role });
    } else {
      usersList = await userModel.find()
    }

    res.status(200).json({ success: true, data: usersList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fieldsToUpdate = [
      "phoneNumber",
      "firstName",
      "lastName",
      "address",
      "gender",
      "role",
      "password",
    ];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined || req.body[field] !== null) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { updateUser, getUsersByRole };
