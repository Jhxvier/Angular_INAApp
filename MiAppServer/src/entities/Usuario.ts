import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../enums/enums';

@Entity({ name: 'tbUsuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false, unique: true })
  username: string;

  @Column({ length: 100, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true, nullable: false })
  estado: boolean;

  hashPassword(): void {
    const saltRounds = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  checkPassword(unhashedPassword: string): boolean {
    return bcrypt.compareSync(unhashedPassword, this.password);
  }
}
