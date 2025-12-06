import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MistalleresService } from '../../../services/mistalleres.service';
import { MisTalleres } from '../../../models/MisTalleres';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-vertallerfaltante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vertallerfaltante.component.html',
  styleUrl: './vertallerfaltante.component.css'
})
export class VertallerfaltanteComponent implements OnInit {
  id: number = 0;
  tallerData!: MisTalleres;
  cargando: boolean = true;
  mapaUrl!: SafeResourceUrl;
  completando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private misTalleresService: MistalleresService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.cargarDatos();
  }

  cargarDatos() {
    this.misTalleresService.listId(this.id).subscribe(data => {
      this.tallerData = data;
      this.cargando = false;
      // AHORA que la dirección existe, generamos el mapa
      const direccion = encodeURIComponent(this.tallerData.taller.direccion);
      const url = `https://www.google.com/maps?q=${direccion}&output=embed`;

      this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  regresar() {
    this.router.navigate(['/mistalleresfaltantes']);
  }

  getImagenUrl(nombreArchivo: string): string {
    return `http://localhost:8081/uploads/${nombreArchivo}`;
  }

  // 🚀 NUEVA FUNCIÓN: completar el taller
  completarTaller() {
    this.completando = true;

    this.misTalleresService.completartaller(this.tallerData.id_mis_talleres).subscribe({
      next: () => {
        this.completando = false;
        alert("¡Taller completado exitosamente!");
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/mistalleresfaltantes']);
        });
      },
      error: () => {
        this.completando = false;
        alert("Hubo un error al completar el taller.");
      }
    });
  }


}
