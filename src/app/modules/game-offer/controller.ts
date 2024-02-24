import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


import sendResponse from "../../../shared/sendResponse";
import { GameOfferService } from "./service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../shared/paginationFields";


const createController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await GameOfferService.createGameOfferService(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Game offer event created successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getAllGameOfferController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterOptions = pick(req.query, ['name', 'location'])
    const paginationOptions = pick(req.query, paginationFields)
    const result = await GameOfferService.getAllGameOffers(paginationOptions,filterOptions);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Offered games retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getSingleGameOfferController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await GameOfferService.getSingleGameOffer(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Offered game for given ID fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const updateGameOfferController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUpdate = await GameOfferService.updateGameOffer(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Offered game updated successfully",
      data: isUpdate,
    });
  } catch (error) {
    next(error)
  }
};

const deleteGameOfferController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted = await GameOfferService.deleteGameOffer(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Offered game deleted successfully",
      data: isDeleted,
    });
  } catch (error) {
    next(error)
  }
};

export const GameOfferController = {
  createController,
  getAllGameOfferController,
  getSingleGameOfferController,
  deleteGameOfferController,
  updateGameOfferController
};
