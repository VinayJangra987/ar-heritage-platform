// const jwt  = require("jsonwebtoken");
// const User = require("../models/User");

// const signToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//   });

// const sendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   user.password = undefined;
//   res.status(statusCode).json({ token, user });
// };

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password)
//       return res.status(400).json({ message: "Name, email and password required." });
//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(400).json({ message: "Email already registered." });
//     const user = await User.create({ name, email, password });
//     sendToken(user, 201, res);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password required." });
//     const user = await User.findOne({ email }).select("+password");
//     if (!user || !(await user.comparePassword(password)))
//       return res.status(401).json({ message: "Invalid email or password." });
//     sendToken(user, 200, res);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate(
//       "favorites", "name thumbnail state type"
//     );
//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const { name, avatar } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { name, avatar },
//       { new: true, runValidators: true }
//     );
//     res.status(200).json({ user });
//   } catch (err) {
//      console.error("❌ SIGNUP ERROR:", err.message); // ← YE ADD KARO
//     console.error(err.stack); 
//     res.status(500).json({ message: err.message });
//   }
// };


const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({ token, user });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password required." });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered." });
    const user = await User.create({ name, email, password });
    sendToken(user, 201, res);
  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password." });
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favorites", "name thumbnail state type"
    );
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};