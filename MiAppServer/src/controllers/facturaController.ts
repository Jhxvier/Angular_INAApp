import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Factura } from "../entities/Factura";
import { DetalleFactura } from "../entities/DetalleFactura";
import { FacturaMapper } from "../mappers/facturaMappers";

export class FacturasController {
  // CREAR FACTURA
  static crear = async (req: Request, res: Response) => {
    const { numero, clienteId, detalles } = req.body;

    if (
      !numero ||
      !clienteId ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "Datos inválidos: numero, clienteId y detalles son requeridos.",
      });
    }

    for (const d of detalles) {
      if (
        !d.productoId ||
        !Number.isInteger(d.cantidad) ||
        d.cantidad <= 0 ||
        Number(d.precioUnitario) <= 0
      ) {
        return res.status(400).json({
          ok: false,
          message:
            "Detalle inválido (productoId, cantidad>0, precioUnitario>0).",
        });
      }
    }

    try {
      const facturaId = await AppDataSource.transaction(async (manager) => {
        const lineas: DetalleFactura[] = detalles.map((d: any) => {
          const linea = new DetalleFactura();
          linea.productoId = Number(d.productoId);
          linea.cantidad = Number(d.cantidad);
          linea.precioUnitario = Number(d.precioUnitario);
          linea.subtotalLinea = Number(
            (linea.cantidad * linea.precioUnitario).toFixed(2),
          );
          return linea;
        });

        const subtotal = Number(
          lineas
            .reduce((acc, l) => acc + Number(l.subtotalLinea), 0)
            .toFixed(2),
        );
        const impuesto = Number((subtotal * 0.13).toFixed(2));
        const total = Number((subtotal + impuesto).toFixed(2));

        const factura = new Factura();
        factura.numero = numero;
        factura.clienteId = Number(clienteId);
        factura.subtotal = subtotal;
        factura.impuesto = impuesto;
        factura.total = total;
        factura.estado = true;
        factura.detalles = lineas;

        const guardada = await manager.save(Factura, factura);
        return guardada.id;
      });

      const facturaRepo = AppDataSource.getRepository(Factura);
      const facturaCompleta = await facturaRepo.findOne({
        where: { id: facturaId },
        relations: ["cliente", "detalles"],
      });

      if (!facturaCompleta) {
        return res.status(500).json({
          ok: false,
          message: "La factura se guardó, pero no se pudo recuperar.",
        });
      }

      return res.status(201).json({
        ok: true,
        factura: FacturaMapper.toFacturaDto(facturaCompleta),
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: "Error al guardar la factura.",
        detail: String(error?.message ?? error),
      });
    }
  };

  // VER FACTURA POR ID
  static verFactura = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const facturaRepo = AppDataSource.getRepository(Factura);
      const factura = await facturaRepo.findOne({
        where: {
          id: Number(id),
          estado: true,
        },
        relations: ["cliente", "detalles"],
      });

      if (!factura) {
        return res.status(404).json({
          ok: false,
          message: "Factura no encontrada",
        });
      }

      return res.json({
        ok: true,
        factura: FacturaMapper.toFacturaDto(factura),
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: "Error al obtener la factura.",
        detail: String(error?.message ?? error),
      });
    }
  };

  // LISTAR FACTURAS ACTIVAS
  static listarActivas = async (_req: Request, res: Response) => {
    try {
      const facturaRepo = AppDataSource.getRepository(Factura);

      const facturas = await facturaRepo.find({
        where: { estado: true },
        relations: ["cliente", "detalles"],
        order: { fechaCreacion: "DESC" },
      });

      return res.json({
        ok: true,
        facturas: facturas.map((f) => FacturaMapper.toFacturaDto(f)),
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: "Error al listar las facturas.",
        detail: String(error?.message ?? error),
      });
    }
  };

  // ELIMINAR LOGICAMENTE
  static eliminarLogico = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const facturaRepo = AppDataSource.getRepository(Factura);

      const factura = await facturaRepo.findOne({
        where: {
          id: Number(id),
          estado: true,
        },
      });

      if (!factura) {
        return res.status(404).json({
          ok: false,
          message: "Factura no encontrada o ya fue eliminada",
        });
      }

      factura.estado = false;
      await facturaRepo.save(factura);

      return res.json({
        ok: true,
        message: "Factura eliminada correctamente",
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: "Error al eliminar la factura.",
        detail: String(error?.message ?? error),
      });
    }
  };

  // MODIFICAR FACTURA
  static modificar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { numero, clienteId, detalles } = req.body;

    if (
      !numero ||
      !clienteId ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "Datos inválidos: numero, clienteId y detalles son requeridos.",
      });
    }

    for (const d of detalles) {
      if (
        !d.productoId ||
        !Number.isInteger(d.cantidad) ||
        d.cantidad <= 0 ||
        Number(d.precioUnitario) <= 0
      ) {
        return res.status(400).json({
          ok: false,
          message:
            "Detalle inválido (productoId, cantidad>0, precioUnitario>0).",
        });
      }
    }

    try {
      const facturaId = await AppDataSource.transaction(async (manager) => {
        const facturaRepo = manager.getRepository(Factura);

        const facturaExistente = await facturaRepo.findOne({
          where: {
            id: Number(id),
            estado: true,
          },
          relations: ["detalles"],
        });

        if (!facturaExistente) {
          throw new Error("Factura no encontrada o eliminada");
        }

        const lineas: DetalleFactura[] = detalles.map((d: any) => {
          const linea = new DetalleFactura();
          linea.productoId = Number(d.productoId);
          linea.cantidad = Number(d.cantidad);
          linea.precioUnitario = Number(d.precioUnitario);
          linea.subtotalLinea = Number(
            (linea.cantidad * linea.precioUnitario).toFixed(2),
          );
          linea.factura = facturaExistente;
          return linea;
        });

        const subtotal = Number(
          lineas
            .reduce((acc, l) => acc + Number(l.subtotalLinea), 0)
            .toFixed(2),
        );
        const impuesto = Number((subtotal * 0.13).toFixed(2));
        const total = Number((subtotal + impuesto).toFixed(2));

        // eliminar detalles anteriores
        if (facturaExistente.detalles && facturaExistente.detalles.length > 0) {
          await manager.remove(DetalleFactura, facturaExistente.detalles);
        }

        // actualizar encabezado
        facturaExistente.numero = numero;
        facturaExistente.clienteId = Number(clienteId);
        facturaExistente.subtotal = subtotal;
        facturaExistente.impuesto = impuesto;
        facturaExistente.total = total;
        facturaExistente.detalles = lineas;

        const actualizada = await manager.save(Factura, facturaExistente);
        return actualizada.id;
      });

      const facturaRepo = AppDataSource.getRepository(Factura);
      const facturaCompleta = await facturaRepo.findOne({
        where: { id: facturaId },
        relations: ["cliente", "detalles"],
      });

      if (!facturaCompleta) {
        return res.status(500).json({
          ok: false,
          message: "La factura se modificó, pero no se pudo recuperar.",
        });
      }

      return res.json({
        ok: true,
        message: "Factura modificada correctamente",
        factura: FacturaMapper.toFacturaDto(facturaCompleta),
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        message: "Error al modificar la factura.",
        detail: String(error?.message ?? error),
      });
    }
  };
}
