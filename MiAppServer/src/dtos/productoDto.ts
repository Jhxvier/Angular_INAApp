import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MaxLength,
} from "class-validator";

// DTO para respuestas
export class ProductoResponseDto {
  id!: number;
  nombre!: string;
  precio!: number;
  inventario!: number;
}

// DTO para crear / actualizar
export class CrearActualizarProductoDto {
  @IsString({ message: "El nombre debe ser texto" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @MaxLength(100, {
    message: "El nombre no puede superar los 100 caracteres",
  })
  nombre!: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El precio debe ser un número válido" },
  )
  @IsPositive({ message: "El precio debe ser mayor a 0" })
  precio!: number;

  @IsInt({ message: "El inventario debe ser un número entero" })
  @Min(0, { message: "El inventario no puede ser negativo" })
  inventario!: number;
}
