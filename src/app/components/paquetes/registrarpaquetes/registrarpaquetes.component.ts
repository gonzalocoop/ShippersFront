import { Component, OnInit } from '@angular/core';
import { Paquetes } from '../../../models/Paquetes';
import { LasFijas } from '../../../models/LasFijas';
import { PaquetesService } from '../../../services/paquetes.service';
import { LasfijasService } from '../../../services/lasfijas.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FechastalleresService } from '../../../services/fechastalleres.service';
import { TalleresService } from '../../../services/talleres.service';
import { Talleres } from '../../../models/Talleres';
import { FechasTalleres } from '../../../models/FechasTalleres';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registrarpaquetes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrarpaquetes.component.html',
  styleUrl: './registrarpaquetes.component.css'
})
export class RegistrarpaquetesComponent implements OnInit {
  paquete: Paquetes = new Paquetes();
  listaFijas: LasFijas[] = [];
  listaFechas: FechasTalleres[] = [];
  selectedUser: string = localStorage.getItem("username") ?? "";
  idUsuarioLogueado = 0;
  fechaSeleccionada?: FechasTalleres;


  constructor(
    private paquetesService: PaquetesService,
    private fijasService: LasfijasService,
    private fechasTalleresService: FechastalleresService,
    private usuarioService: UsuariosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarUsuarioLogueado();

  }

  cargarFijas() {
    this.fijasService.fijasSegunUsuario(this.idUsuarioLogueado).subscribe(data => {
      this.listaFijas = data;
    });
  }

  cargarFechas() {
    if (!this.paquete.fijas || !this.paquete.fijas.taller) return;

    const idTaller = this.paquete.fijas.taller.id_taller;

    this.fechasTalleresService.buscarPorIdTaller(idTaller).subscribe(data => {
      this.listaFechas = data;
    });
  }
  cargarUsuarioLogueado() {
    this.usuarioService.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
      this.cargarFijas();
    });
  }
  registrarPaquete() {
    if (!this.fechaSeleccionada) return;
    // ❗ VALIDACIÓN cantidad > 0 y precio > 0
    if (!this.paquete.cantidad_personas || this.paquete.cantidad_personas <= 0) {
      alert("La cantidad de personas debe ser mayor a 0");
      return;
    }

    if (!this.paquete.precio || this.paquete.precio <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }
    // Insertar fecha y hora EXACTOS como vienen del backend
    this.paquete.dia = new Date(this.fechaSeleccionada.dia);
    this.paquete.hora = this.fechaSeleccionada.hora;

    // Opcional: bloquear UI mientras procesa
    // this.isProcessing = true;

    console.log('Antes de insertar, paquete.fijas =', this.paquete.fijas);

    this.paquetesService.insert(this.paquete).subscribe({
      next: (resp) => {
        alert("Paquete registrado correctamente");
        console.log("Respuesta insert:", resp);
        console.log("paquete.fijas tras insert:", this.paquete.fijas);

        const idFijas = this.paquete?.fijas?.id_fijas;
        if (!idFijas && idFijas !== 0) {
          console.error("ERROR: id_fijas viene undefined. No se puede activar.");
          // this.isProcessing = false;
          return;
        }

        // <-- IMPORTANTE: suscribirse para que se ejecute la petición HTTP
        this.fijasService.activarFijas(idFijas).subscribe({
          next: () => {
            console.log("Fija activada correctamente");
            // actualizar UI, recargar lista, etc.
            // this.cargarFijas(); // si corresponde
            // this.isProcessing = false;
          },
          error: err => {
            console.error("Error al activar fija:", err);
            // this.isProcessing = false;
          }
        });
      },
      error: err => {
        console.error("Error al registrar paquete", err);
        // this.isProcessing = false;
      }
    });

    this.router.navigate(['/talleres']);
  }

}
