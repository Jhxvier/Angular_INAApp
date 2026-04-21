import { Producto } from "../entities/Producto";
import { ProductoResponseDto } from "../dtos/productoDto";

export class ProductoMapper {
  static toProductoResponseDto(entity: Producto): ProductoResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      precio: Number(entity.precio),
      inventario: entity.inventario,
    };
  }

  static toProductoResponseDtoList(
    entities: Producto[],
  ): ProductoResponseDto[] {
    return entities.map(this.toProductoResponseDto);
  }
}
