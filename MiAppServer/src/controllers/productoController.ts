import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Producto } from "../entities/Producto";
import { ProductoMapper } from "../mappers/productoMappers";

class ProductoController {
  static getAllProductos = async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Producto);
      const productos = await repo.find({ where: { estado: true } });

      if (!productos.length) {
        return res
          .status(404)
          .json({ message: "No hay productos registrados" });
      }

      return res
        .status(200)
        .json(ProductoMapper.toProductoResponseDtoList(productos));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static getProductoById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const repo = AppDataSource.getRepository(Producto);
      const producto = await repo.findOneBy({
        id: Number(id),
        estado: true,
      });

      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      return res
        .status(200)
        .json(ProductoMapper.toProductoResponseDto(producto));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static crearProducto = async (req: Request, res: Response) => {
    try {
      const { nombre, precio, inventario } = req.body;

      const repo = AppDataSource.getRepository(Producto);

      // Regla de negocio
      const existente = await repo.findOneBy({
        nombre,
        estado: true,
      });

      if (existente) {
        return res
          .status(400)
          .json({ message: "Ya existe un producto con ese nombre" });
      }

      const nuevoProducto = repo.create({
        nombre,
        precio,
        inventario,
        estado: true,
      });

      await repo.save(nuevoProducto);

      return res.status(201).json({
        message: "Producto creado exitosamente",
        producto: ProductoMapper.toProductoResponseDto(nuevoProducto),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al crear producto", error });
    }
  };

  static actualizarProducto = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nombre, precio, inventario } = req.body;

      const repo = AppDataSource.getRepository(Producto);
      const producto = await repo.findOneBy({
        id: Number(id),
        estado: true,
      });

      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      // Regla de negocio
      const existente = await repo.findOneBy({
        nombre,
        estado: true,
      });

      if (existente && existente.id !== producto.id) {
        return res
          .status(400)
          .json({ message: "Ya existe un producto con ese nombre" });
      }

      producto.nombre = nombre;
      producto.precio = precio;
      producto.inventario = inventario;

      await repo.save(producto);

      return res
        .status(200)
        .json(ProductoMapper.toProductoResponseDto(producto));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static eliminarProducto = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const repo = AppDataSource.getRepository(Producto);
      const producto = await repo.findOneBy({ id: Number(id) });

      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      producto.estado = false;
      await repo.save(producto);

      return res
        .status(200)
        .json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };
}

export default ProductoController;
