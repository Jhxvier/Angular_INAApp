import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Expose, Exclude } from "class-transformer";

@Exclude()
export class CrearActualizarClienteDto {
  @Expose()
  @IsString({ message: "El nombre debe ser texto" })
  @IsNotEmpty({ message: "El nombre es obligatorio" })
  @MaxLength(100, {
    message: "El nombre no puede superar los 100 caracteres",
  })
  nombre!: string;

  @Expose()
  @IsEmail({}, { message: "El correo no es válido" })
  correo!: string;

  @Expose()
  @IsOptional()
  @IsString({ message: "El teléfono debe ser texto" })
  @MaxLength(20, {
    message: "El teléfono no puede superar los 20 caracteres",
  })
  telefono?: string;
}
