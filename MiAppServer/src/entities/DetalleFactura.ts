import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Factura } from "./Factura";

@Entity("detalle_facturas")
export class DetalleFactura {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productoId!: number;

  @Column("int", { default: 1 })
  cantidad!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  precioUnitario!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  subtotalLinea!: number;

  @Column()
  facturaId!: number;

  @ManyToOne(() => Factura, (factura) => factura.detalles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "facturaId" })
  factura!: Factura;
}
