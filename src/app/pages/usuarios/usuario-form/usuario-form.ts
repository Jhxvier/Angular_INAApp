import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { Usuario, UserRole } from '../../../models/usuario.Model';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-usuario-form',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UsuarioForm>);
  data = inject(MAT_DIALOG_DATA) as { usuario: Usuario | null; isModificar: boolean };

  roles = Object.values(UserRole);

  private passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!this.data.isModificar) {
      return null;
    }
    if (password || confirmPassword) {
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
    return null;
  };

  form = this.fb.group(
    {
      id: [{ value: this.data.usuario?.id ?? null, disabled: true }],

      username: [
        this.data.usuario?.username || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],

      role: [this.data.usuario?.role || UserRole.USER, [Validators.required]],

      password: [
        '',
        this.data.isModificar
          ? [Validators.minLength(6)]
          : [Validators.required, Validators.minLength(6)],
      ],

      confirmPassword: [''],
    },
    { validators: this.passwordMatchValidator },
  );

  constructor() {
    console.log('Datos recibidos:', this.data);
    if (!this.data.isModificar && this.data.usuario) {
      this.form.disable();
    }
  }

  esFormularioValido(): boolean {
    if (!this.data.isModificar) {
      return true;
    }
    const formValue = this.form.getRawValue();
    const cambioPassword = !!(formValue.password && formValue.confirmPassword);
    const cambioUsername = formValue.username !== this.data.usuario?.username;
    const cambioRole = formValue.role !== this.data.usuario?.role;
    return cambioPassword || cambioUsername || cambioRole;
  }

  guardar() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();

      if (this.data.isModificar) {
        const password = formValue.password;
        const confirmPassword = formValue.confirmPassword;
        const cambioPassword = !!(password && confirmPassword);
        const cambioUsername = formValue.username !== this.data.usuario?.username;
        const cambioRole = formValue.role !== this.data.usuario?.role;

        if (!cambioPassword && !cambioUsername && !cambioRole) {
          this.dialogRef.close(null);
          return;
        }

        if (cambioPassword && password) {
          if (password.length < 6) {
            this.form.get('password')?.setErrors({ minlength: true });
            this.form.get('password')?.markAsTouched();
            return;
          }
          if (password !== confirmPassword) {
            this.form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            this.form.get('confirmPassword')?.markAsTouched();
            return;
          }
        }

        const updates: Partial<Usuario> = {
          id: this.data.usuario?.id,
        };

        if (cambioUsername) {
          updates.username = formValue.username || undefined;
        }

        if (cambioRole) {
          updates.role = formValue.role ?? undefined;
        }

        if (cambioPassword && password) {
          updates.password = password;
        }

        console.log('Datos a guardar:', updates);
        this.dialogRef.close(updates);
      } else {
        const usuarioData = {
          username: formValue.username || '',
          password: formValue.password || '',
          role: formValue.role ?? UserRole.USER,
        };

        console.log('Datos a guardar:', usuarioData);
        this.dialogRef.close(usuarioData);
      }
    }
  }
}
