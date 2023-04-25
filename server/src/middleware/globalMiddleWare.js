import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import { Error } from "mongoose";
import { getEnvironment } from "../environments/env";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log({ error: error.array() });
      next(res.json({ error: error.array() }));
    } else {
      next();
    }
  }

  static async authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
    try {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          next(err);
        } else if (!decoded) {
          req.errorStatus = 401;
          next(new Error("User Not Authorised"));
        } else {
          req.user = decoded;

          next();
        }
      });
    } catch (e) {
      req.errorStatus = 401;
      console.log(e);
      next(e);
    }
  }
}