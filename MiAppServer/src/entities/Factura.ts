import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { DetalleFactura } from "./DetalleFactura";

@Entity("facturas")
export class Factura {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 30, unique: true })
  numero!: string;

  @Column()
  clienteId!: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.facturas, { eager: true })
  @JoinColumn({ name: "clienteId" })
  cliente!: Cliente;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  subtotal!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  impuesto!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ type: "boolean", default: true })
  estado!: boolean;

  @OneToMany(() => DetalleFactura, (detalle) => detalle.factura, {
    cascade: ["insert", "update"],
    eager: true,
  })
  detalles!: DetalleFactura[];

  @CreateDateColumn()
  fechaCreacion!: Date;

  @UpdateDateColumn()
  fechaActualizacion!: Date;
}
