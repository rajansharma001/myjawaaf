import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../model/userSchema.ts";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findOne({ email: decode.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.isVerified) {
      return res.status(403).json({ msg: "User already verified" });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ msg: "User verified success" });
  } catch (error) {
    return res.status(500).json({ msg: "Bad Request for User verification" });
  }
};
