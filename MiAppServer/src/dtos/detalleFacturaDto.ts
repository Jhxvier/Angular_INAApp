import { IsInt, Min } from "class-validator";

export class DetalleFacturaDto {
  @IsInt()
  @Min(1)
  productoId!: number;

  @IsInt()
  @Min(1)
  cantidad!: number;
}
