import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LasFijas } from '../../models/LasFijas';
import { LasfijasService } from '../../services/lasfijas.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-fijassinactivar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fijassinactivar.component.html',
  styleUrl: './fijassinactivar.component.css'
})
export class FijassinactivarComponent implements OnInit{
   selectedUser: string = localStorage.getItem("username") ?? "";
  idUsuarioLogueado: number = 0;
  listaFijas: LasFijas[] = [];

  cargando: boolean = true;

  constructor(
    private lfService: LasfijasService,
    private uS: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
  }

  cargarUsuarioLogueado() {
    if (!this.selectedUser) return;

    this.uS.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
      this.cargarFijas();
    });
  }

  cargarFijas() {
    this.lfService.fijasSegunUsuario(this.idUsuarioLogueado).subscribe({
      next: data => {
        this.listaFijas = data.filter(f => f.activo === false);
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.cargando = false;
      }
    });
  }
}
