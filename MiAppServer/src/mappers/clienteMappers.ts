import { Cliente } from "../entities/Cliente";
import { CrearActualizarClienteDto } from "../dtos/clienteDto";

export class ClienteMapper {
  static toClienteResponseDto(entity: Cliente): CrearActualizarClienteDto {
    return {
      nombre: entity.nombre,
      correo: entity.correo,
      telefono: entity.telefono || undefined,
    };
  }

  static toClienteResponseDtoList(
    entities: Cliente[],
  ): CrearActualizarClienteDto[] {
    return entities.map(this.toClienteResponseDto);
  }
}
