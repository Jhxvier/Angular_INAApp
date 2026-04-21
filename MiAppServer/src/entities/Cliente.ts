import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Factura } from "./Factura";

@Entity("clientes")
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100, unique: true })
  correo!: string;

  @Column({ length: 20, nullable: true })
  telefono?: string;

  @Column({ default: true })
  activo!: boolean;

  @OneToMany(() => Factura, (factura) => factura.cliente)
  facturas!: Factura[];

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  fechaActualizacion!: Date;
}
