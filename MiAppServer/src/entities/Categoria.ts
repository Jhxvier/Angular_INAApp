import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100, unique: true, nullable: false })
  nombre: string;
  @Column({ nullable: true, default: null, length: 500 })
  descripcion: string;
  @Column({ default: true, nullable: false })
  estado: boolean;
}
