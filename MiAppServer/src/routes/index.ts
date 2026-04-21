import { Router } from "express";
import auth from "./auth";
import usuarios from "./usuario";
import clientes from "./clientes";
import categorias from "./categorias";
import productos from "./producto";
import facturas from "./factura";

const ROUTES = Router();

ROUTES.use("/auth", auth);
ROUTES.use("/usuarios", usuarios);
ROUTES.use("/clientes", clientes);
ROUTES.use("/categorias", categorias);
ROUTES.use("/productos", productos);
ROUTES.use("/facturas", facturas);

export default ROUTES;
