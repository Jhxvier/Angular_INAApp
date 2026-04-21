import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categoria } from "../entities/Categoria";
import { CategoriaMapper } from "../mappers/categoriasMappers";

class categoriaController {
  // Obtener todas las categorías
  static getAllCategorias = async (req: Request, res: Response) => {
    try {
      // Obtener el repositorio de la entidad Categoria
      const repo = AppDataSource.getRepository(Categoria);

      // Buscar todas las categorías con estado true
      const listaCategorias = await repo.find({ where: { estado: true } });

      // Si no hay categorías, devolver un 404
      if (listaCategorias.length === 0) {
        return res
          .status(404)
          .json({ message: "No hay categorías registradas" });
      }

      // Devolver la lista de categorías con un 200
      return res
        .status(200)
        .json(CategoriaMapper.toCategoriaResponseDtoList(listaCategorias));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static getCategoriaById = async (req: Request, res: Response) => {
    //DESTRUCTURIZAR EL ID DE LOS PARAMETROS
    try {
      const { id } = req.params;

      const repo = AppDataSource.getRepository(Categoria);
      //BUSCAR LA CATEGORIA POR ID Y ESTADO TRUE
      const categoria = await repo.findOneBy({ id: Number(id), estado: true });

      if (!categoria) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      return res
        .status(200)
        .json(CategoriaMapper.toCategoriaResponseDto(categoria));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static crearCategoria = async (req: Request, res: Response) => {
    //DESTRUCTURIZAR EL BODY
    try {
      const { nombre, descripcion } = req.body;

      /*if (!nombre || nombre.trim().length === 0) {
        return res.status(400).json({ message: "El nombre es requerido" });
      }*/

      //reglas de negocio
      const repo = AppDataSource.getRepository(Categoria);
      //verificar si ya existe una categoria con el mismo nombre y estado true
      const categoriaExistente = await repo.findOneBy({
        nombre: nombre,
        estado: true,
      });

      if (categoriaExistente) {
        return res
          .status(400)
          .json({ message: "Ya existe una categoría con ese nombre" });
      }

      //crear una nueva categoria
      const nuevaCategoria = repo.create({
        nombre,
        descripcion,
        estado: true,
      });

      //guardar la nueva categoria en la base de datos
      await repo.save(nuevaCategoria);
      return res
        .status(201)
        .json({ message: "Categoría creada exitosamente", nuevaCategoria });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al crear categoria", error });
    }
  };

  static actualizarCategoria = async (req: Request, res: Response) => {
    //destructurizar
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      //acceder al repositorio
      const repo = AppDataSource.getRepository(Categoria);
      //buscar la categoria por id y estado true
      const categoria = await repo.findOneBy({ id: Number(id) });

      if (!categoria) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      //Reglas de negocio
      const categoriaExistente = await repo.findOneBy({
        nombre: nombre,
        estado: true,
      });
      if (categoriaExistente) {
        return res
          .status(400)
          .json({ message: "Ya existe una categoría con ese nombre" });
      }

      //actualizar la categoria
      categoria.nombre = nombre;
      categoria.descripcion = descripcion;

      //guardar los cambios
      await repo.save(categoria);
      return res
        .status(200)
        .json(CategoriaMapper.toCategoriaResponseDto(categoria));
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };

  static eliminarCategoria = async (req: Request, res: Response) => {
    try {
      //desetructurizar id
      const { id } = req.params;

      //acceder al repositorio
      const repo = AppDataSource.getRepository(Categoria);
      const categoria = await repo.findOneBy({ id: Number(id) });

      //validar si la categoria existe
      if (!categoria) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }

      //eliminar la categoria (cambio de estado)
      categoria.estado = false;
      await repo.save(categoria);
      return res
        .status(200)
        .json({ message: "Categoría eliminada exitosamente", categoria });
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor", error });
    }
  };
}

export default categoriaController;
