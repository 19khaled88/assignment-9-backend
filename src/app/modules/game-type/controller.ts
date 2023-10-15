import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


import sendResponse from "../../../shared/sendResponse";
import { GameTypeService } from "./service";

const createController = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const result = await GameTypeService.createGameTypeService(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Game type created successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getAllGameTypeController = async (req: Request, res: Response) => {
  const result = await GameTypeService.getAllGameType();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Game type retrieved successfully",
    data: result,
  });
};

const getSingleGameTypeController = async (req: Request, res: Response) => {
  const result = await GameTypeService.getSingleGameType(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Game type fetched successfully",
    data: result,
  });
};

const updateGameTypeController = async (req: Request, res: Response) => {
  const isUpdate = await GameTypeService.updateGameType(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "game type updated successfully",
    data: isUpdate,
  });
};

const deleteGameTypeControler = async (req: Request, res: Response) => {
  const isDeleted = await GameTypeService.deleteGameType(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Turf deleted successfully",
    data: isDeleted,
  });
};

export const GameTypeController = {
  createController,
  getAllGameTypeController,
  getSingleGameTypeController,
  updateGameTypeController,
  deleteGameTypeControler
};