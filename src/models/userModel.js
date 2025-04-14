const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.role === "admin") {
            return value != null && value.length > 0;
          }
          return true;
        },
        message: "Password is required for admin users.",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password == null || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
