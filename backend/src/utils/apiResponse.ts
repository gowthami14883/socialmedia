// apiResponse.ts

import { Response } from "express";

class APIResponse {

  successResponse(res: Response, msg: string = "Success", data?: any) {

    const resData: any = {
      success: true,
      message: msg,
    };

    if (data) resData.data = data;

    res.status(200).json(resData);
  }

  createdResponse(res: Response, msg: string = "Created", data?: any) {

    const resData: any = {
      success: true,
      message: msg,
    };

    if (data) resData.data = data;

    res.status(201).json(resData);
  }

  noContentResponse(res: Response, msg: string = "Success") {

    const resData: any = {
      success: true,
      message: msg,
    };

    res.status(204).json(resData);
  }

  validationErrorResponse(res: Response, msg: string = "Validation Error", data?: any) {

    const resData: any = {
      success: false,
      message: msg,
    };

    if (data) resData.data = data;

    res.status(400).json(resData);
  }

  unauthorizedResponse(res: Response, msg: string = "Unauthorized") {

    const resData: any = {
      success: false,
      message: msg,
    };

    res.status(401).json(resData);
  }

  forbiddenResponse(res: Response, msg: string = "Forbidden") {

    const resData: any = {
      success: false,
      message: msg,
    };

    res.status(403).json(resData);
  }

  notFoundResponse(res: Response, msg: string = "Not Found") {

    const resData: any = {
      success: false,
      message: msg,
    };

    res.status(404).json(resData);
  }

  rateLimitResponse(res: Response, msg: string = "Rate Limit Exceeded") {

    const resData: any = {
      success: false,
      message: msg,
    };

    res.status(429).json(resData);
  }

  errorResponse(res: Response, msg: string = "Something went wrong",data:any=null,statusCode:number=500) {

    const resData: any = {
      success: false,
      message: msg,
      data,
    };

    res.status(500).json(resData);
  }

}

export default new APIResponse();