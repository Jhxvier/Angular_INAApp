export class DetalleFacturaResponseDto {
  productoId!: number;
  cantidad!: number;
  precioUnitario!: number;
  subtotalLinea!: number;
}

export class FacturaResponseDto {
  id!: number;
  numero!: string;
  clienteId!: number;
  clienteNombre!: string;
  subtotal!: number;
  impuesto!: number;
  total!: number;
  detalles!: DetalleFacturaResponseDto[];
}
