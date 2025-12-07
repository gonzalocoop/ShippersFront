import { Component, OnInit } from '@angular/core';
import { Comentarios } from '../../../models/Comentarios';
import { ComentariosService } from '../../../services/comentarios.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listarcomentarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listarcomentarios.component.html',
  styleUrl: './listarcomentarios.component.css'
})
export class ListarcomentariosComponent implements OnInit{
    selectedUser: string = localStorage.getItem("username") ?? "";
  idUsuarioLogueado: number = 0;

  comentarios: Comentarios[] = [];
  comentariosVisibles: Comentarios[] = [];

  step: number = 3; 
  index: number = 0;

  cargando: boolean = true;

  constructor(
    private cS: ComentariosService,
    private uS: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
  }

  cargarUsuarioLogueado() {
    this.uS.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
      this.cargarComentarios();
    });
  }

  cargarComentarios() {
    this.cS.comentariosSegunUsuario(this.idUsuarioLogueado).subscribe(data => {
      this.comentarios = data;
      this.agregarComentarios();
      this.cargando = false;
    });
  }

  agregarComentarios() {
    const nuevos = this.comentarios.slice(this.index, this.index + this.step);
    this.comentariosVisibles = [...this.comentariosVisibles, ...nuevos];
    this.index += this.step;
  }

  getImagenUrl(nombreArchivo: string): string {
    return `https://shipperapp.azurewebsites.net/uploads/${nombreArchivo}`;
  }
}
