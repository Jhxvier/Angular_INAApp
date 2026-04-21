import { Router } from "express";
import ProductoController from "../controllers/productoController";
import { validateRequest } from "../middleware/validateRequest";
import { CrearActualizarProductoDto } from "../dtos/productoDto";
import { idParamDto } from "../dtos/IdParamDto";

const ROUTES = Router();

ROUTES.get("/", ProductoController.getAllProductos);

ROUTES.get(
  "/:id",
  validateRequest({ params: idParamDto }),
  ProductoController.getProductoById,
);

ROUTES.post(
  "/",
  validateRequest({ body: CrearActualizarProductoDto }),
  ProductoController.crearProducto,
);

ROUTES.patch(
  "/:id",
  validateRequest({ params: idParamDto, body: CrearActualizarProductoDto }),
  ProductoController.actualizarProducto,
);

ROUTES.delete(
  "/:id",
  validateRequest({ params: idParamDto }),
  ProductoController.eliminarProducto,
);

export default ROUTES;
