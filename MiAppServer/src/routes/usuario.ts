import { UsuarioController } from "../controllers/UsuarioController";
import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { createUsuarioDto, updateUsuarioDto } from "../dtos/UsuarioDto";

const ROUTES = Router();

ROUTES.get("/", UsuarioController.getUsuarios);
ROUTES.get("/:id", UsuarioController.getUsuarioById);
ROUTES.post(
  "/",
  validateRequest({ body: createUsuarioDto }),
  UsuarioController.createUsuarios,
);
ROUTES.patch("/:id", validateRequest({ body: updateUsuarioDto }), UsuarioController.updateUsuario);
ROUTES.delete("/:id", UsuarioController.deleteUsuario);

export default ROUTES;
