import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import { UsuarioMapper } from "../mappers/UsuariosMapper";
import { UserRole } from "../enums/enums";
export class UsuarioController {
//Obtener todos los usuarios (solo los activos)
  static getUsuarios = async (req: Request, res: Response) => {
    try {
      const repo = AppDataSource.getRepository(Usuario);
      const usuarios = await repo.find({ where: { estado: true } });
      const usuariosDto = UsuarioMapper.toResponseDtoList(usuarios);
      return res.json(usuariosDto);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener los usuarios" });
    }
  };

//Obtener un usuario por ID
  static getUsuarioById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(Usuario);
      const usuario = await repo.findOneBy({ id: Number(id) });
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.json(UsuarioMapper.toResponseDto(usuario));
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el usuario" });
    }
  };

  static createUsuarios = async (req: Request, res: Response) => {
    try {
      const { username, password, role } = req.body;

      //reglas de negocio para crear un usuario

      const repo = AppDataSource.getRepository(Usuario);

      //verificar si el username ya existe
      const existingUser = await repo.findOneBy({ username });

      if (existingUser) {
        return res.status(400).json({
          message: "El nombre de usuario (correo electrónico) ya existe",
        });
      }

      //hashear la contraseña antes de guardarla (opcional, pero recomendado)

      //crear el nuevo usuario
      const newUser = repo.create({ username, password, role });

      //enviar a hashear la contraseña
      newUser.hashPassword();

      await repo.save(newUser);

      return res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
  };

  //Modificar un usuario
  static updateUsuario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { username, password, role } = req.body;

      const repo = AppDataSource.getRepository(Usuario);
      const usuario = await repo.findOneBy({ id: Number(id) });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      //verificar si el nuevo username ya existe en otro usuario
      if (username && username !== usuario.username) {
        const existingUser = await repo.findOneBy({ username });
        if (existingUser) {
          return res.status(400).json({
            message: "El nombre de usuario ya existe",
          });
        }
        usuario.username = username;
      }

      // Convertir el role string a enum si se proporciona
      if (role) {
        usuario.role = role as UserRole;
      }

      // Solo actualizar password si se proporciona y no está vacía
      if (password && password.trim()) {
        usuario.password = password;
        usuario.hashPassword();
      }

      await repo.save(usuario);
      return res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };

//Desactivar un usuario (borrado lógico)
  static deleteUsuario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(Usuario);
      const usuario = await repo.findOneBy({ id: Number(id) });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      usuario.estado = false;
      await repo.save(usuario);
      return res.json({ message: "Usuario desactivado correctamente" });
    } catch (error) {
      return res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  };
}
