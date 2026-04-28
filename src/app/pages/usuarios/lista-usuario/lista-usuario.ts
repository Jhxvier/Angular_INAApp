import { AfterViewInit, Component, inject, OnInit, ViewChild, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsuarioService } from '../../../service/usuario-service';
import { Usuario } from '../../../models/usuario.Model';
import { MATERIAL_IMPORTS } from '../../../shared/material-imports';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { ToastrService } from 'ngx-toastr';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-lista-usuario',
  imports: [...MATERIAL_IMPORTS],
  templateUrl: './lista-usuario.html',
  styleUrl: './lista-usuario.scss',
})
export class ListaUsuario implements OnInit, AfterViewInit {
  usuarios: Usuario[] = [];
  private usuarioService = inject(UsuarioService);
  private dialog = inject(MatDialog);

  private toastr = inject(ToastrService);

  displayedColumns: string[] = ['id', 'username', 'role', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.table.renderRows();
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createModificaUsuario(usuario: Usuario | null, isMod: boolean): void {
    const dialogRef = this.dialog.open(UsuarioForm, {
      width: '600px',
      height: '800px',
      data: { usuario, isModificar: isMod },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (isMod && usuario) {
        this.usuarioService.modificarUsuario(result).subscribe({
          next: (data) => {
            console.log('Usuario actualizado:', data);
            this.toastr.success('Usuario actualizado correctamente', 'Éxito');
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error al actualizar el usuario:', error);
            this.toastr.error('Error al actualizar el usuario', 'Error');
          },
        });
      } else {
        this.usuarioService.createUsuario(result).subscribe({
          next: (data) => {
            console.log('Usuario creado:', data);
            this.toastr.success('Usuario creado correctamente', 'Éxito');
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error al crear el usuario:', error);
            this.toastr.error('Error al crear el usuario', 'Error');
          },
        });
      }
    });
  }
  eliminarUsuario(usu: Usuario): void {
    if (confirm(`¿Estás seguro de eliminar el usuario "${usu.username}"?`)) {
      this.usuarioService.eliminarUsuario(usu.id).subscribe({
        next: () => {
          console.log('Usuario eliminado');
          this.toastr.success('Usuario eliminado correctamente', 'Éxito');
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar el usuario:', error);
          this.toastr.error('Error al eliminar el usuario', 'Error');
        },
      });
    }
  }
}
