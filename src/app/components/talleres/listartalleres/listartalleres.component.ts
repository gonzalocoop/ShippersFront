import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Talleres } from '../../../models/Talleres';
import { TalleresService } from '../../../services/talleres.service';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-listartalleres',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule],
  templateUrl: './listartalleres.component.html',
  styleUrl: './listartalleres.component.css'
})
export class ListartalleresComponent implements OnInit{
  talleres: Talleres[] = [];
  filteredTalleres: Talleres[] = [];
  pagedTalleres: Talleres[] = [];

  // Filtros
  searchText: string = '';
  categoriaFiltro: string = '';
  departamentoFiltro: string = '';
  role: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private tS: TalleresService, public route: ActivatedRoute, private lS: LoginService) {}

  ngOnInit(): void {

  this.role = this.lS.showRole();
  // 🟦 Obtener el filtro desde el query param
  this.route.queryParams.subscribe(params => {
    const dept = params['departamento'];
    if (dept) {
      this.departamentoFiltro = dept;
    }
  });

  // 🟦 Cargar talleres y aplicar filtro inicial
  this.tS.list().subscribe(data => {
    this.talleres = data;
    this.filteredTalleres = data;

    // Aplicar filtro si vino desde el mapa
    this.aplicarFiltros();

    this.updatePagedTalleres();
  });
}


  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => this.updatePagedTalleres());
    }
  }

  updatePagedTalleres(): void {
    if (!this.paginator) return;

    const start = this.paginator.pageIndex * this.paginator.pageSize;
    const end = start + this.paginator.pageSize;

    this.pagedTalleres = this.filteredTalleres.slice(start, end);
  }

  aplicarFiltros(): void {
    this.filteredTalleres = this.talleres.filter(t =>
      t.titulo.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.categoriaFiltro ? t.categoria === this.categoriaFiltro : true) &&
      (this.departamentoFiltro ? t.departamento === this.departamentoFiltro : true) &&
      (t.activo == true)
    );

    this.paginator.pageIndex = 0;
    this.updatePagedTalleres();
  }
  getImagenUrl(nombreArchivo: string): string {
    return `http://localhost:8081/uploads/${nombreArchivo}`;
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
