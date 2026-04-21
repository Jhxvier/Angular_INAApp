import { Factura } from "../entities/Factura";
import { DetalleFactura } from "../entities/DetalleFactura";
import {
  FacturaResponseDto,
  DetalleFacturaResponseDto,
} from "../dtos/facturaDto";

export class FacturaMapper {
  static toDetalleDto(detalle: DetalleFactura): DetalleFacturaResponseDto {
    return {
      productoId: detalle.productoId,
      cantidad: detalle.cantidad,
      precioUnitario: Number(detalle.precioUnitario),
      subtotalLinea: Number(detalle.subtotalLinea),
    };
  }

  static toFacturaDto(factura: Factura): FacturaResponseDto {
    return {
      id: factura.id,
      numero: factura.numero,
      clienteId: factura.clienteId,
      clienteNombre: factura.cliente ? factura.cliente.nombre : "",
      subtotal: Number(factura.subtotal),
      impuesto: Number(factura.impuesto),
      total: Number(factura.total),
      detalles: factura.detalles
        ? factura.detalles.map((d) => this.toDetalleDto(d))
        : [],
    };
  }
}
