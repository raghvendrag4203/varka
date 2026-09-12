import { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: z.flattenError(result.error).fieldErrors,
      });
    }

    req.body = result.data; // replace with cleaned data
    next();
  };