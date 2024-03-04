import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


import sendResponse from "../../../shared/sendResponse";
import { FieldService } from "./service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../shared/paginationFields";

const createController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FieldService.createFieldService(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Field created successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getAllFieldController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterOptions = pick(req.query, ['searchTerm', 'code', 'size'])
    const paginationOptions = pick(req.query, paginationFields)
    const result = await FieldService.getAllFields(paginationOptions,filterOptions);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Fields retrieved successfully",
      data: result,
    });
    // res.send({
    //   statusCode: 200,
    //   success: true,
    //   message: "Fields retrieved successfully",
    //   result,
    // })
  } catch (error) {
    next(error)
  }
};

const getSingleFieldController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FieldService.getSingleField(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Field fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const singleFieldByTurfId =async(req: Request, res: Response, next: NextFunction)=>{
  try {
    const result = await FieldService.singleFieldByTurfId(req.params.turfId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Field for given turf id fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
}

const updateFieldController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUpdate = await FieldService.updateField(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Field for given ID updated successfully",
      data: isUpdate,
    });
  } catch (error) {
    next(error)
  }
};

const deleteFieldController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted = await FieldService.deleteField(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Field for given Id deleted successfully",
      data: isDeleted,
    });
    // res.send({
    //   statusCode: 200,
    //   success: true,
    //   message: "Field for given Id deleted successfully",
    //   isDeleted,
    // })
  } catch (error) {
    next(error)
  }
};

export const FieldController = {
  createController,
  getAllFieldController,
  getSingleFieldController,
  updateFieldController,
  deleteFieldController,
  singleFieldByTurfId
};
