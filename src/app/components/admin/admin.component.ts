import { Component, OnInit } from '@angular/core';
import { Talleres } from '../../models/Talleres';
import { LasFijas } from '../../models/LasFijas';
import { Paquetes } from '../../models/Paquetes';
import { TalleresService } from '../../services/talleres.service';
import { LasfijasService } from '../../services/lasfijas.service';
import { PaquetesService } from '../../services/paquetes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComentariosService } from '../../services/comentarios.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  listaTalleres: Talleres[] = [];
  listaFijas: LasFijas[] = [];
  listaPaquetes: Paquetes[] = [];
  role: string = '';
  idTallerActivar: number = 0;
  idTallerDesactivar:number=0;
  idFijasActivar: number = 0;
  idFijasDesactivar: number = 0;

  nuevaFija: LasFijas = new LasFijas();
  idTallerParaFija: number = 0;

  constructor(
    private talleresService: TalleresService,
    private fijasService: LasfijasService,
    private paquetesService: PaquetesService,
    private comentariosService:ComentariosService,
    private lS: LoginService
  ) {}

  ngOnInit(): void {
    this.cargarTablas();
    this.role = this.lS.showRole();
  }

  cargarTablas() {
    this.talleresService.list().subscribe(data => this.listaTalleres = data);
    this.fijasService.list().subscribe(data => this.listaFijas = data);
    this.paquetesService.list().subscribe(data => this.listaPaquetes = data);
  }

  activarTaller() {
    if (!this.idTallerActivar) return;

    this.talleresService.activarTaller(this.idTallerActivar).subscribe(() => {
      this.cargarTablas();
    });
  }

  desactivarTaller() {
    if (!this.idTallerDesactivar) return;

    this.talleresService.desactivarTaller(this.idTallerDesactivar).subscribe(() => {
      this.cargarTablas();
    });
  }

  activarFijas() {
    if (!this.idFijasActivar) return;

    this.fijasService.activarFijas(this.idFijasActivar).subscribe(() => {
      this.fijasService.list().subscribe(data => this.listaFijas = data);
    });
  }

  desactivarFijas() {
    if (!this.idFijasDesactivar) return;

    this.fijasService.desactivarFijas(this.idFijasDesactivar).subscribe(() => {
      this.fijasService.list().subscribe(data => this.listaFijas = data);
    });
  }

  registrarFija() {
    const fija = new LasFijas();
    fija.titulo = this.nuevaFija.titulo;

    fija.taller.id_taller = this.idTallerParaFija;
    fija.activo=false;
    this.fijasService.insert(fija).subscribe(() => {
      this.nuevaFija = new LasFijas();
      this.idTallerParaFija = 0;
      this.cargarTablas();
    });
  }

  actualizarComentarios() {
    

    this.comentariosService.actualizarCalificacionDeTodosLosTalleres().subscribe({
      next: (res) => {
        console.log("Calificaciones actualizadas correctamente");
        alert("✔️ Calificaciones actualizadas");
      },
      error: (err) => {
        console.error(err);
        alert("❌ Error al actualizar calificaciones");
      }
    });;
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
