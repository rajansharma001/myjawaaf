import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../model/userSchema";
import { sendEmailVerification } from "../../middleware/email/sendEmailVerification";

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({ msg: "User not registered." });
    }
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      {
        fullname: existingUser.fullname,
        email: existingUser.email,
        phone: existingUser.phone,
        role: existingUser.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    const link = `${process.env.CLIENT_URL}/api/auth/verify-password-email/${token}`;
    await sendEmailVerification(existingUser.email, link);

    return res.status(200).json({
      msg: `Password updated link has been sent to ${email}. Please verify your email to update your password`,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Password updated Bad Request" });
  }
};
