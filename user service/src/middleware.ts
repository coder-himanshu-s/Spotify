import { NextFunction, Request, Response } from "express";
import TryCatch from "./utils/TryCatch.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "./model.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({
        success: false,
        message: "Please login",
      });

      return;
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decodedToken || !decodedToken._id) {
      res.status(403).json({
        success: false,
        message: "Please login",
      });
      return;
    }

    const userId = decodedToken._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(403).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Please login",
    });
  }
};
