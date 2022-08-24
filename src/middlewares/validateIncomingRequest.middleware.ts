import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";

export const validateIncomingRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(
        {
          body: req.body,
          query: req.query,
          params: req.params,
        }
        // { abortEarly: false }
      );

      return next();
    } catch (err: any) {
      // console.error(JSON.stringify(err));
      return res.status(422).send({
        Message: "Failure",
        data:
          err?.path && err?.message
            ? {
                [err?.path]: err?.message,
              }
            : {
                obsolete: "One or more validation error occured",
              },
      });
    }
  };
