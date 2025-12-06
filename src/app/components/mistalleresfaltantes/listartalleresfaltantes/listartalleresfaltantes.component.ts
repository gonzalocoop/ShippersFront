import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MisTalleres } from '../../../models/MisTalleres';
import { MistalleresService } from '../../../services/mistalleres.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-listartalleresfaltantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listartalleresfaltantes.component.html',
  styleUrl: './listartalleresfaltantes.component.css',
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateX(40px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateX(-40px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ListartalleresfaltantesComponent implements OnInit{
listaMisTalleres: MisTalleres[] = [];
  selectedUser: string = localStorage.getItem("username") ?? "";
  idUsuarioLogueado = 0;
  tallerActual!: MisTalleres;
  indexActual = 0;
  animacionEstado = 0;
  constructor(
    private misTalleresService: MistalleresService,
    private usuarioService: UsuariosService,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.usuarioService.usuarioPorUsername(this.selectedUser)
      .pipe(
        switchMap(user => {
          this.idUsuarioLogueado = user.id_usuario;
          return this.misTalleresService.misTalleresSegunUsuario(this.idUsuarioLogueado);
        })
      )
      .subscribe(data => {

        this.listaMisTalleres = data
          .filter(m => m.completado === false)
          .filter(m => m.taller && m.taller.titulo);

        this.tallerActual = this.listaMisTalleres[0];
      });
  }

  siguiente() {
    if (this.listaMisTalleres.length === 0) return;

    this.indexActual = (this.indexActual + 1) % this.listaMisTalleres.length;
    this.tallerActual = this.listaMisTalleres[this.indexActual];
    this.animacionEstado++;
  }

  anterior() {
    if (this.listaMisTalleres.length === 0) return;

    this.indexActual =
      (this.indexActual - 1 + this.listaMisTalleres.length) %
      this.listaMisTalleres.length;

    this.tallerActual = this.listaMisTalleres[this.indexActual];
    this.animacionEstado--;
  }


   irADetalle(id: number) {
    this.router.navigate(['/mistalleresfaltantes/vertaller', id]);
  }

  getImagenUrl(nombreArchivo: string): string {
    return `http://localhost:8081/uploads/${nombreArchivo}`;
  }
}
