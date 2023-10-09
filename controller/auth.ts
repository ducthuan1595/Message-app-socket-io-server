import { Request, Response } from "express";

import {
  loginService,
  signupService,
  getAllUserService,
} from "../service/auth";

import { ResponseType } from "../types";
import { RequestUserType } from "../middleware/auth";

export interface loginValueInputType {
  email: String;
  password: String | Buffer;
}

export interface signupValueInputType extends loginValueInputType {
  name: String;
  pic?: String;
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json({ message: "Not found" });
  } else {
    const values: loginValueInputType = {
      email,
      password,
    };
    const data: any = await loginService(values, req);
    if (data) {
      res
        .status(data.status)
        .json({ message: data.message, data: data?.data, token: data?.token });
    }
  }
};

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, pic } = req.body;
  if (name && email && password) {
    const values: signupValueInputType = {
      name,
      email,
      password,
      pic,
    };
    const data: any = await signupService(values);
    if (data) {
      res.status(data.status).json({ message: data.message });
    }
  }
};

export const getAllUser = async (req: RequestUserType, res: Response) => {
  const key: any = req.query?.key;
  const data: any = await getAllUserService(key, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data.data });
  }
};
