import { Express, Request, Response } from "express";

import { ResponseType } from "../types";
import { RequestUserType } from "../middleware/auth";

import {
  chatService,
  fetchChatService,
  createGroupChatService,
  renameGroupService,
  addGroupChatService,
  removeUserGroupService,
} from "../service/chat";

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

export const getChatController = async (
  req: RequestUserType,
  res: Response
) => {
  const data: any = await fetchChatService(req);
  if (data) {
    res.status(data.status).json({ message: data.message, data: data?.data });
  }
};

export const createGroupChat = async (req: RequestUserType, res: Response) => {
  const { chatName, userId } = req.body;
  if (!chatName || userId.length < 1) {
    res.status(404).json({ message: "Not found" });
  } else {
    const data: any = await createGroupChatService(chatName, userId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

export const renameGroup = async (req: RequestUserType, res: Response) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    res.status(404).json({ message: "Not found" });
  } else {
    const data: any = await renameGroupService(chatId, chatName, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

export const addGroupChat = async (req: RequestUserType, res: Response) => {
  const { chatId, userId } = req.body;

  if (!chatId || userId.length < 2) {
    res.status(404).json({ message: "Not found" });
  } else {
    const data: any = await addGroupChatService(chatId, userId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};

export const removeUserGroup = async (req: RequestUserType, res: Response) => {
  const { chatId } = req.body;
  if (!chatId) {
    res.status(404).json({ message: "Not found" });
  } else {
    const data: any = await removeUserGroupService(chatId, req);
    if (data) {
      res.status(data.status).json({ message: data.message, data: data?.data });
    }
  }
};
