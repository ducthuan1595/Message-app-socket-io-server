import jwt from "jsonwebtoken";
import { Express, Request, Response, NextFunction } from "express";
import User from "../model/user";
import { UserType } from "../types";

export interface RequestUserType extends Request {
  user?: UserType;
}

const protect = async (
  req: RequestUserType,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (process.env.JWT_SECRET) {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded && decoded.id) {
          const user: UserType = await User.findById(decoded.id).select(
            "-password"
          );
          if (user) {
            req.user = user;
          }
          next();
        }
      }
    } catch (err) {
      console.error(err);

      res.status(403).json({ message: "Not authorized" });
    }
  }
};

export default protect;
