import { z } from "zod";
export const validate = (schema) => (req, res, next) => {
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
//# sourceMappingURL=validate.middleware.js.map