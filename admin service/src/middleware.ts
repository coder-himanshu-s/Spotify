import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv();
interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: String;
  playlist: string[];
}
interface AuthenticatedRequest extends Request {
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

    const { data } = await axios.get(
      `${process.env.USER_URL}/api/v1/user/profile`,
      {
        headers: {
          token,
        },
      }
    );

    req.user = data;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Please login",
    });
  }
};


// setup multer

import multer from "multer";
const storage = multer.memoryStorage();
const uploadFile = multer({ storage }).single("file");
export default uploadFile;
