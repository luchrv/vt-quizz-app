import jwt from "jsonwebtoken";
import config from "../config";
import { setResponse } from "../libs/responses";
import User from "../models/User";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token)
      return res.status(403).json(setResponse(403, "No token provided", null));

    const decoded = jwt.verify(token.split(" ")[1], config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user)
      return res.status(404).json(setResponse(404, "User not found", null));

    next();
  } catch (error) {
    return res.status(401).json(setResponse(401, "Token is invalid", null));
  }
};
