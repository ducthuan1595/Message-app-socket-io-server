import bcrypt from "bcrypt";
import { Request } from "express";

import User from "../model/user";
import generateToken from "../config/generalToken";

import { loginValueInputType } from "../controller/auth";
import { signupValueInputType } from "../controller/auth";
import { RequestUserType } from "../middleware/auth";

export const loginService = (values: loginValueInputType, req: Request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: values.email });
      if (user) {
        const validPw = await bcrypt.compare(
          Buffer.from(values.password),
          user.password
        );
        const id = user._id.toString();
        if (validPw) {
          resolve({
            message: "ok",
            status: 200,
            data: user,
            token: generateToken(id),
          });
        } else {
          resolve({ message: " Password's incorrect", status: 402, data: {} });
        }
      } else {
        resolve({ message: " User's not exist", status: 401, data: {} });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const signupService = ({
  email,
  name,
  password,
  pic,
}: signupValueInputType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.find({ email: email });
      if (!user.length) {
        const pw = await bcrypt.hash(Buffer.from(password), 12);
        const newUser = new User({
          name,
          email,
          password: pw,
          pic: pic,
        });
        const user = await newUser.save();
        const id = user._id.toString();
        resolve({
          message: "ok",
          status: 200,
          token: generateToken(id),
        });
      } else {
        resolve({
          status: 404,
          message: "User already exists",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getAllUserService = (
  key: string | undefined,
  req: RequestUserType
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req && req.user) {
        const keyword = key
          ? {
              $or: [
                { name: { $regex: key, $options: "i" } },
                { email: { $regex: key, $options: "i" } },
              ],
            }
          : {};
        const users = await User.find(keyword).find({
          _id: { $ne: req.user._id },
        }); // Not get current user
        resolve({
          status: 200,
          message: "ok",
          data: users,
        });
      } else {
        resolve({
          status: 403,
          message: "Unauthorized",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const editUserService = (
  name: string,
  pic: string,
  req: RequestUserType
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.user) {
        let updateUser;
        if (name) {
          updateUser = await User.findByIdAndUpdate(req.user._id, {
            name,
          }).select("-password");
        }
        if (pic) {
          updateUser = await User.findByIdAndUpdate(req.user._id, {
            pic,
          }).select("-password");
        }

        resolve({
          status: 201,
          message: "ok",
          data: updateUser,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
