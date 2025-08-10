import { NextFunction, Request, Response } from "express";
import { Document, Model } from "mongoose";

// Middleware for checking input
export const checkInput = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const isEmpty = Object.keys(data).length === 0;
  if (isEmpty) {
    return res.status(400).json({
      status: 400,
      message: "Body cannot be empty",
    });
  }
  next();
};

// Factory functions
export function createFactory<T extends Document>(elementModel: Model<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const elementDetail = req.body;
      const isEmpty = Object.keys(elementDetail).length === 0;
      if (isEmpty) {
        return res.status(400).json({
          status: 400,
          message: "Body cannot be empty",
        });
      }
      const data = await elementModel.create(elementDetail);
      res.status(201).json({
        status: 201,
        message: "Data created successfully!",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}

export function getFactory<T extends Document>(elementModel: Model<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await elementModel.find();
      if (data.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data not found",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Data found",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}

export function getFactoryById<T extends Document>(elementModel: Model<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await elementModel.findById(id);
      if (!data) {
        return res.status(404).json({
          status: 404,
          message: "Data not found",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Data found",
        data: data,
      });
    } catch (err) {
      next(err);
    }
  };
}

export function updateFactoryById<T extends Document>(elementModel: Model<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedData = await elementModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedData) {
        return res.status(404).json({
          status: 404,
          message: "Data not found",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Data updated successfully",
        data: updatedData,
      });
    } catch (err) {
      next(err);
    }
  };
}

export function deleteFactoryById<T extends Document>(elementModel: Model<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deletedData = await elementModel.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(404).json({
          status: 404,
          message: "Data not found",
        });
      }
      res.status(200).json({
        status: 200,
        message: "Data deleted successfully",
        data: deletedData,
      });
    } catch (err) {
      next(err);
    }
  };
}

export function searchFactoryByParams<T extends Document>(
  elementModel: Model<T>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sortQuery = req.query.sort as string;
      const selectQuery = req.query.select as string;
      const filterQueryRaw = req.query.filter;
      let filterQuery: Record<string, any> = {};
      if (typeof filterQueryRaw === "string") {
        try {
          filterQuery = JSON.parse(filterQueryRaw);
        } catch {
          return res.status(400).json({ message: "Invalid filter JSON" });
        }
      } else if (
        typeof filterQueryRaw === "object" &&
        filterQueryRaw !== null
      ) {
        filterQuery = filterQueryRaw as Record<string, any>;
      }

      let query: any = elementModel.find(filterQuery);

      // Sorting
      if (sortQuery) {
        const [sortParam, order] = sortQuery.split(" ");
        query = query.sort(order === "asc" ? sortParam : `-${sortParam}`);
      }

      // Selecting fields
      if (selectQuery) {
        query = query.select(selectQuery) as ReturnType<
          typeof elementModel.find
        >;
      }

      // Pagination
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 5;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      const result = await query.exec();

      res.status(200).json({
        message: "Search successful!",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
