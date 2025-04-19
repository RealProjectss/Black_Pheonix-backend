const userModel = require("../models/userModel");

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    let usersList;
    if (role) {
      usersList = await userModel.find({ role: role }).select("-password");
    } else {
      usersList = await userModel.find().select("-password");
    }

    res.status(200).json({ success: true, data: usersList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userModel
      .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
      .select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { updateUser, getUsersByRole };
