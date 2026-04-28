import { IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../enums/enums';

//DTO para la respuesta de usuario
export class UsuarioResponseDto {
  id!: number;
  username!: string;
  password!: string;
  role!: string;
}

//DTO para crear usuario
export class createUsuarioDto {
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  })
  @MaxLength(100, {
    message: 'El nombre de usuario no debe exceder los 100 caracteres',
  })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, {
    message: 'La contraseña no debe exceder los 100 caracteres',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsEnum(UserRole, { message: 'El rol debe ser un valor válido' })
  role: UserRole;
}

//DTO para actualizar usuario
export class updateUsuarioDto {
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  })
  @MaxLength(100, {
    message: 'El nombre de usuario no debe exceder los 100 caracteres',
  })
  @IsOptional()
  username?: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, {
    message: 'La contraseña no debe exceder los 100 caracteres',
  })
  @IsOptional()
  password?: string;

  @IsOptional()
  role?: any;
}

//DTO legacy para compatibilidad
export class createUpateUsuarioDto {
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  })
  @MaxLength(100, {
    message: 'El nombre de usuario no debe exceder los 100 caracteres',
  })
  @IsOptional()
  username?: string;

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, {
    message: 'La contraseña no debe exceder los 100 caracteres',
  })
  @IsOptional()
  password?: string;

  @IsEnum(UserRole, { message: 'El rol debe ser un valor válido' })
  @IsOptional()
  role?: UserRole;
}
