import { body, param, query } from "express-validator";
import { Types } from "mongoose";
interface ValidationSchema {
    body?: {
      [key: string]: (fields: string[]) => any;
    };
    query?: {
      [key: string]: (fields: string[]) => any;
    };
    param?: {
      [key: string]: (fields: string[]) => any;
    };
  }
const validationSchema:ValidationSchema = {
  body: {
    number: (fields) =>
      fields.map((field) =>
        body(field)
          .trim()
          .isNumeric()
          .withMessage(`${field} must be a numeric value!`)
          .optional()
      ),
    requiredNumber: (fields) =>
      fields.map((field) =>
        body(field)
          .trim()
          .notEmpty()
          .withMessage(`${field} is required`)
          .isNumeric()
          .withMessage(`${field} must be a numeric value!`)
      ),
    requiredText: (fields) =>
      fields.map((field) =>
        body(field)
          .trim()
          .notEmpty()
          .withMessage(`${field} Field cannot be empty!`)
          .escape()
      ),
    text: (fields) =>
      fields.map((field) =>
        body(field)
          .trim()
          .isString()
          .withMessage(`${field} Field cannot be empty!`)
          .escape()
          .optional()
      ),
    array: (fields) =>
      fields?.map((filed) =>
        body(filed).isArray().withMessage(`${filed} should be an Array!`)
      ),
    mongooseId: (fields) =>
      fields?.map((field) =>
        body(field).custom((value) => {
          let isValidId = Types.ObjectId.isValid(value);
          if (!isValidId) {
            throw new Error(`${value} must be a valid mongoose ObjectId`);
          }
          return Promise.resolve();
        })
      ),
    date: (fields) =>
      fields?.map((filed) =>
        body(filed).isDate().withMessage(`${filed} should be Date!`)
      ),
  },
  query: {
    required: (fields) =>
      fields?.map((field) =>
        query(field)
          .trim()
          .notEmpty()
          .withMessage(`Missing ${field} query parameter!`)
          .escape()
      ),
    optional: (fields) =>
      fields?.map((field) => query(field).trim().optional().escape()),
    mongooseId: (fields) =>
      fields?.map((field) =>
        query(field).custom((value) => {
          let isValidId = Types.ObjectId.isValid(value);
          if (!isValidId) {
            throw new Error(`${value} must be a valid mongoose ObjectId`);
          }
          return Promise.resolve();
        })
      ),
    date: (fields) =>
      fields?.map((filed) =>
        query(filed).isDate().withMessage(`${filed} should be Date!`)
      ),
  },
  param: {
    required: (fields) =>
      fields?.map((field) =>
        param(field)
          .trim()
          .notEmpty()
          .withMessage(`${field} is missing in the URL!`)
      ),
    optional: (fields) => fields?.map((field) => param(field).trim()),
    mongooseId: (fields) =>
      fields?.map((field) =>
        param(field).custom((value) => {
          let isValidId = Types.ObjectId.isValid(value);
          if (!isValidId) {
            throw new Error(`${value} must be a valid mongoose ObjectId`);
          }
          return Promise.resolve();
        })
      ),
    date: (fields) =>
      fields?.map((filed) =>
        param(filed).isDate().withMessage(`${filed} should be Date!`)
      ),
  },
};
export default validationSchema;
