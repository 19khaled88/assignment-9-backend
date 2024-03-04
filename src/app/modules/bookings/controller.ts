import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import sendResponse from "../../../shared/sendResponse";
import { BookingService } from "./service";
import pick from "../../../shared/pick";
import { paginationOptionFields } from "../../../common/paginationOptions";

const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BookingService.createBookingService(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New booking created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};



const getAllBookingsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const filterOptions = pick(req.query, ['vehicle_id','user_id','start_location','end_location','start_time','end_time'])
    const paginationOptions = pick(req.query, paginationOptionFields)
    const result = await BookingService.getAllBookingService(req?.user?.role, req?.user?.userId,paginationOptions);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All bookings retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const getSingleBookingController = async (req: Request, res: Response) => {
  const result = await BookingService.getSingleBookingService(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single booking for given ID fetched successfully",
    data: result,
  });
};

const updateBookingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUpdate = await BookingService.updateBookingService(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking updated successfully",
      data: isUpdate,
    });
  } catch (error) {
    next(error)
  }
};

const deleteBookingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isDeleted = await BookingService.deleteBookingService(req.params.id,req?.user?.userId,req?.user?.role);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Booking deleted successfully",
      data: isDeleted,
    });
  } catch (error) {
    next(error)
  }
};

export const BookingController = {
  createBookingController,
  getAllBookingsController,
  getSingleBookingController,
  deleteBookingController,
  updateBookingController,
};
