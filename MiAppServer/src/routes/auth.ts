import { Router } from "express";
import { AuthController } from "../controllers/Authcontroller";
import { validateRequest } from "../middleware/validateRequest";
import { loginDto } from "../dtos/LogingDto";

const ROUTES = Router();

ROUTES.post(
  "/login",
  validateRequest({ body: loginDto }),
  AuthController.login,
);

export default ROUTES;
