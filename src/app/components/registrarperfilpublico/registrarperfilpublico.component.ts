import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

import { PerfilPublico } from '../../models/PerfilPublico';
import { PerfilpublicoService } from '../../services/perfilpublico.service';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-registrarperfilpublico',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule, CommonModule, FormsModule],
  templateUrl: './registrarperfilpublico.component.html',
  styleUrl: './registrarperfilpublico.component.css'
})
export class RegistrarperfilpublicoComponent implements OnInit{
  perfil: PerfilPublico = new PerfilPublico();
  selectedUser: string = "";
  idUsuarioLogueado = 0;
  role: string = '';
  tienePerfil = false; // si ya existe -> update

  constructor(
    private perfilService: PerfilpublicoService,
    private uS: UsuariosService,
    private lS: LoginService
  ) {}

  ngOnInit(): void {
    this.role = this.lS.showRole();
    if (typeof window !== 'undefined') {
    this.selectedUser = localStorage.getItem("username") ?? "";
  }
 
  this.cargarUsuarioLogueado();
  }

  cargarUsuarioLogueado() {
    this.uS.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
      this.cargarPerfil();
    });
  }

  cargarPerfil() {
    this.perfilService.perfilDeUsuario(this.idUsuarioLogueado).subscribe(data => {

      if (data.length > 0) {
        // Ya existe un perfil, se carga para editar
        this.perfil = data[0];
        this.tienePerfil = true;
      } else {
        // No existe, se prepara uno nuevo
        this.perfil = new PerfilPublico();
        this.perfil.usua.id_usuario = this.idUsuarioLogueado;
        this.tienePerfil = false;
      }

    });
  }

  guardarPerfil() {
    this.perfil.usua.id_usuario = this.idUsuarioLogueado;
    this.perfil.descripcion.replace(/\r\n/g, '\n');
    if (this.tienePerfil) {
      // UPDATE
      this.perfilService.update(this.perfil).subscribe(() => {
        alert("Perfil actualizado correctamente");
      });
    } else {
      // INSERT
      this.perfilService.insert(this.perfil).subscribe(() => {
        alert("Perfil creado correctamente");
      });
    }
  }

  verificar() {
    this.role = this.lS.showRole();
    return this.lS.verificar();
  }
  isAdmin() {
    return this.role === 'ADMINISTRADOR';
  }

  isUser() {
    return this.role === 'USUARIO';
  }

  isEmprender() {
    return this.role === 'EMPRENDEDOR';
  }
}
