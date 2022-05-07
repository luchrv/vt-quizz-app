import User from "../models/User";
import config from "../config";
import jwt from "jsonwebtoken";
import { setResponse } from "../libs/responses";

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ username: username });
    if (user) return res.status(400).json(setResponse(400, "User already exists", null));

    const mail = await User.findOne({ email: email });
    if (mail) return res.status(400).json(setResponse(400, "Email already exists", null));

    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return res
      .status(200)
      .json(setResponse(200, "User created successfully", { token }));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(setResponse(500, "Internal server error", null));
  }
};

export const signIn = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email: req.body.email });

    if (!userFound)
      return res.status(400).json(setResponse(400, "User not found", null));

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res
        .status(401)
        .json(setResponse(401, "Password is incorrect", null));

    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.json(setResponse(200, "User signed in successfully", { token }));
  } catch (error) {
    console.log(error);
    res.status(500).send(setResponse(500, "Internal server error", null));
  }
};
