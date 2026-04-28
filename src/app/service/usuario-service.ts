import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.Model';
import { environment } from '../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}${environment.endpoints.usuarios}`;

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.post<Usuario>(this.apiUrl, usuario, { headers: headers });
  }

  modificarUsuario(usuario: Usuario): Observable<Usuario> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.patch<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario, {
      headers: headers,
    });
  }

  eliminarUsuario(id: number): Observable<void> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }
}