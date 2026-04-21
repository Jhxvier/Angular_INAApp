import {
  IsNotEmpty,
  IsOptional,
  IsString,
  isString,
  MaxLength,
  maxLength,
} from "class-validator";

//devolveruna categoria
export class CategoriaResponseDto {
  id!: number;
  nombre!: string;
  descripcion?: string;
}

//crear o actualizar categoria
export class crearActualizarCategoriaDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @MaxLength(100, { message: "El nombre no puede tener más de 100 caracteres" })
  nombre!: string;
  @IsOptional()
  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @MaxLength(500, {
    message: "La descripción no puede tener más de 500 caracteres",
  })
  descripcion?: string;
}
