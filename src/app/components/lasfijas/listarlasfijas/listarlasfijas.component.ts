import { Component, OnInit } from '@angular/core';
import { LasfijasService } from '../../../services/lasfijas.service';
import { PaquetesService } from '../../../services/paquetes.service';
import { LasFijas } from '../../../models/LasFijas';
import { Paquetes } from '../../../models/Paquetes';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatCard, MatCardContent, MatCardActions } from "@angular/material/card";
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-listarlasfijas',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCard, MatCardContent, RouterModule],
  templateUrl: './listarlasfijas.component.html',
  styleUrl: './listarlasfijas.component.css'
})
export class ListarlasfijasComponent implements OnInit {
  listaFijas: LasFijas[] = [];
  paquetesPorFija: { [key: number]: Paquetes[] } = {};
  role: string = '';
  constructor(
    private fijasService: LasfijasService,
    private paquetesService: PaquetesService,
    private lS: LoginService
  ) { }

  ngOnInit(): void {
    this.cargarFijas();
    this.role = this.lS.showRole();
  }

  cargarFijas() {
    this.fijasService.list().subscribe({
      next: (fijas) => {
        this.listaFijas = fijas.filter(f => f.activo === true);
        this.cargarPaquetesParaCadaFija();
      },
      error: (err) => console.error("Error al cargar fijas:", err)
    });
  }

  cargarPaquetesParaCadaFija() {
    this.listaFijas.forEach(fija => {
      this.paquetesService.paquetesSegunFijas(fija.id_fijas).subscribe({
        next: (paquetes) => {
          this.paquetesPorFija[fija.id_fijas] = paquetes;
        },
        error: (err) =>
          console.error(`Error al cargar paquetes de fija ${fija.id_fijas}:`, err)
      });
    });
  }
  getImagenUrl(nombreArchivo: string): string {
    return `https://shipperapp.azurewebsites.net/uploads/${nombreArchivo}`;
  }

  scrollPaquetes(id: number, direction: 'left' | 'right') {
    const container = document.querySelector(`.paquetes-scroll[data-id="${id}"]`);

    if (!container) return;

    const amount = 160; // cantidad a desplazar por click

    if (direction === 'left') container.scrollLeft -= amount;
    else container.scrollLeft += amount;
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
