import { Router } from "express";
import ClienteController from "../controllers/clienteControllers";
import { validateRequest } from "../middleware/validateRequest";
import { CrearActualizarClienteDto } from "../dtos/clienteDto";
import { idParamDto } from "../dtos/IdParamDto";

const ROUTES = Router();

ROUTES.get("/", ClienteController.getAllClientes);

ROUTES.get(
  "/:id",
  validateRequest({ params: idParamDto }),
  ClienteController.getClienteById,
);

ROUTES.post(
  "/",
  validateRequest({ body: CrearActualizarClienteDto }),
  ClienteController.crearCliente,
);

ROUTES.patch(
  "/:id",
  validateRequest({ params: idParamDto, body: CrearActualizarClienteDto }),
  ClienteController.actualizarCliente,
);

ROUTES.delete(
  "/:id",
  validateRequest({ params: idParamDto }),
  ClienteController.eliminarCliente,
);

export default ROUTES;
