import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


import { paginationFields } from "../../../shared/paginationFields";
import pick from "../../../shared/pick";
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

const getAllGameTypeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterOptions = pick(req.query, ['searchTerm','name'])
    const paginatinOptions = pick(req.query, paginationFields)

    const result = await GameTypeService.getAllGameType(paginatinOptions, filterOptions);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Game type retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }

};

const getSingleGameTypeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await GameTypeService.getSingleGameType(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Game type fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const updateGameTypeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUpdate = await GameTypeService.updateGameType(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "game type updated successfully",
      data: isUpdate,
    });
  } catch (error) {
    next(error)
  }
};

const deleteGameTypeControler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted = await GameTypeService.deleteGameType(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Game type deleted successfully",
      data: isDeleted,
    });
  } catch (error) {
    next(error)
  }
};

export const GameTypeController = {
  createController,
  getAllGameTypeController,
  getSingleGameTypeController,
  updateGameTypeController,
  deleteGameTypeControler
};
