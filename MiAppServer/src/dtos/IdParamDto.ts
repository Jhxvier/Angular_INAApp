import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class idParamDto {
  @Type(() => Number)
  @IsInt({ message: "El id debe ser un número entero" })
  @Min(1, { message: "El id debe ser un número positivo mayor que 0" })
  id!: number;
}
