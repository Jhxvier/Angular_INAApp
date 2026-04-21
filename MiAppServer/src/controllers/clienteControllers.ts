import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cliente } from "../entities/Cliente";
import { ClienteMapper } from "../mappers/clienteMappers";

class ClienteController {
  // Obtener todos los clientes
  static getAllClientes = async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Cliente);
      const clientes = await repo.find({ where: { activo: true } });

      if (!clientes.length) {
        return res.status(404).json({ message: "No hay clientes registrados" });
      }

      return res
        .status(200)
        .json(ClienteMapper.toClienteResponseDtoList(clientes));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static getClienteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const repo = AppDataSource.getRepository(Cliente);
      const cliente = await repo.findOneBy({
        id: Number(id),
        activo: true,
      });

      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res.status(200).json(ClienteMapper.toClienteResponseDto(cliente));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static crearCliente = async (req: Request, res: Response) => {
    try {
      const { nombre, correo, telefono } = req.body;

      const repo = AppDataSource.getRepository(Cliente);

      // Regla de negocio
      const existente = await repo.findOneBy({
        correo,
        activo: true,
      });

      if (existente) {
        return res
          .status(400)
          .json({ message: "Ya existe un cliente con ese correo" });
      }

      const nuevoCliente = repo.create({
        nombre,
        correo,
        telefono,
        activo: true,
      });

      await repo.save(nuevoCliente);

      return res.status(201).json({
        message: "Cliente creado exitosamente",
        cliente: ClienteMapper.toClienteResponseDto(nuevoCliente),
      });
    } catch (error) {
      return res.status(500).json({ message: "Error al crear cliente", error });
    }
  };

  static actualizarCliente = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nombre, correo, telefono } = req.body;

      const repo = AppDataSource.getRepository(Cliente);
      const cliente = await repo.findOneBy({ id: Number(id), activo: true });

      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      // Regla de negocio
      const existente = await repo.findOneBy({
        correo,
        activo: true,
      });

      if (existente && existente.id !== cliente.id) {
        return res
          .status(400)
          .json({ message: "Ya existe un cliente con ese correo" });
      }

      cliente.nombre = nombre;
      cliente.correo = correo;
      cliente.telefono = telefono;

      await repo.save(cliente);

      return res.status(200).json(ClienteMapper.toClienteResponseDto(cliente));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static eliminarCliente = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const repo = AppDataSource.getRepository(Cliente);
      const cliente = await repo.findOneBy({ id: Number(id) });

      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      cliente.activo = false;
      await repo.save(cliente);

      return res
        .status(200)
        .json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };
}

export default ClienteController;
