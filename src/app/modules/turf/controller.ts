import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


import sendResponse from "../../../shared/sendResponse";
import { TurfService } from "./service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../shared/paginationFields";

const createController = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const result = await TurfService.createTurfService(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Turf created successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getAllTurfsController = async (req: Request, res: Response) => {

  const filterOptions = pick(req.query, ['searchTerm','name', 'location', 'owner'])
  const paginationOptions = pick(req.query, paginationFields)
  const result = await TurfService.getAllTurfs(paginationOptions, filterOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Turfs retrieved successfully",
    data: result,
  });
};

const getSingleTurfController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TurfService.getSingleTurf(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Turf fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const updateTurfController = async (req: Request, res: Response) => {
  const isUpdate = await TurfService.updateTurf(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Turf updated successfully",
    data: isUpdate,
  });
};

const deleteTurfControler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted = await TurfService.deleteTurf(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Turf deleted successfully",
      data: isDeleted,
    });
  } catch (error) {
    next(error)
  }

};

export const TurfController = {
  createController,
  getAllTurfsController,
  getSingleTurfController,
  updateTurfController,
  deleteTurfControler
};
