import { Express, Request, Response } from "express";

import { chatService } from "../service/chat";
import { ResponseType } from "../types";
import { RequestUserType } from "../middleware/auth";

export const chatsController = async (req: RequestUserType, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(404).json({ message: "Not found" });
  }
  const data: any = await chatService(userId, req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};
