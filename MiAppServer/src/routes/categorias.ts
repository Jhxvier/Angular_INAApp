import { Router } from "express";
import categoriaController from "../controllers/categoriaController";
import { validateRequest } from "../middleware/validateRequest";
import { crearActualizarCategoriaDto } from "../dtos/categoriaDto";
import { idParamDto } from "../dtos/IdParamDto";
import { checkJWT } from "../middleware/jwt";
import { checkRole } from "../middleware/role";
import { UserRole } from "../enums/enums";

const ROUTES = Router();
debugger;
ROUTES.get("/", categoriaController.getAllCategorias);
ROUTES.get(
  "/:id",
  [
    checkJWT,
    checkRole([UserRole.ADMIN]),
    validateRequest({ params: idParamDto }),
  ], //validacciones de middleware
  categoriaController.getCategoriaById,
);
ROUTES.post(
  "/",
  [checkJWT, validateRequest({ body: crearActualizarCategoriaDto })], //validacciones de middleware
  categoriaController.crearCategoria,
);

ROUTES.patch(
  "/:id",
  validateRequest({ params: idParamDto, body: crearActualizarCategoriaDto }),
  categoriaController.actualizarCategoria,
);

ROUTES.delete(
  "/:id",
  validateRequest({ params: idParamDto }),
  categoriaController.eliminarCategoria,
);

export default ROUTES;
