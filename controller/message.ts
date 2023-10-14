import { QueryParams, RequestUserType } from "../middleware/auth";
import { Response } from "express";

import { sendMessageService, getMessageService } from "../service/message";

export const sendMessage = async (req: RequestUserType, res: Response) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(404).json({ message: "Not found" });
  } else {
    const data: any = await sendMessageService(content, chatId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

export const getMessage = async (req: RequestUserType, res: Response) => {
  const { chatId } = req.query;

  if (typeof chatId !== "string") {
    res.status(404).json({ message: "Not found" });
  } else {
    const data: any = await getMessageService(chatId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};
