import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [...MATERIAL_IMPORTS, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

// Se exporta la clase Login para poder usarla en otros archivos
export class Login {
  // Se inyecta FormBuilder usando la función inject (Angular moderno)
  // FormBuilder sirve para crear formularios reactivos de manera más sencilla
  private fb = inject(FormBuilder);

  // Se define el formulario reactivo llamado loginForm
  // fb.group crea un grupo de controles (formulario)
  loginForm = this.fb.group({
    // Campo "email"
    // Valor inicial: '' (vacío)
    // Validaciones:
    // - required: obligatorio
    // - email: formato de correo válido
    username: ['', [Validators.required, Validators.email]],

    // Campo "password"
    // Valor inicial: '' (vacío)
    // Validaciones:
    // - required: obligatorio
    // - minLength(6): mínimo 6 caracteres
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log(username);
      console.log(password);
    }
  }
}
