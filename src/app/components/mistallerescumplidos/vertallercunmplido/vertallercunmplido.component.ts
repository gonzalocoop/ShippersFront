import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MistalleresService } from '../../../services/mistalleres.service';
import { MisTalleres } from '../../../models/MisTalleres';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-vertallercunmplido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vertallercunmplido.component.html',
  styleUrl: './vertallercunmplido.component.css'
})
export class VertallercunmplidoComponent  implements OnInit {
    id: number = 0;
  tallerData!: MisTalleres;
  cargando: boolean = true;
  mapaUrl!: SafeResourceUrl;
  constructor(
    private route: ActivatedRoute,
    private misTalleresService: MistalleresService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

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
    this.router.navigate(['/mistallerescumplidos']);
  }

  getImagenUrl(nombreArchivo: string): string {
    return `https://shipperapp.azurewebsites.net/uploads/${nombreArchivo}`;
  }
}
