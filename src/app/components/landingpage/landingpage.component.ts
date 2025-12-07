import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LasfijasService } from '../../services/lasfijas.service';
import { LasFijas } from '../../models/LasFijas';
@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent implements OnInit {
// Referencia al contenedor que queremos desplazar en el HTML
  @ViewChild('cardsTrack') cardsTrack!: ElementRef<HTMLDivElement>;
  
  fijas: LasFijas[] = [];

  constructor(private lfS: LasfijasService) {}

  ngOnInit(): void {
    this.lfS.listarFijasFuera().subscribe(data => {
      this.fijas = data;
    });
  }

  getImagenUrl(nombreArchivo: string): string {
    return `https://shipperapp.azurewebsites.net/uploads/${nombreArchivo}`;
  }

  /**
   * Desplaza el carrusel de tarjetas horizontalmente.
   * @param direction 'next' para mover a la derecha, 'prev' para mover a la izquierda.
   */
  scrollCarousel(direction: 'next' | 'prev'): void {
    if (!this.cardsTrack) {
      console.error('El contenedor de tarjetas no está disponible.');
      return;
    }

    // El desplazamiento se calcula como el ancho de la tarjeta (260px) más el gap (20px)
    const scrollAmount = 280; 

    if (direction === 'next') {
      // Mueve a la derecha
      this.cardsTrack.nativeElement.scrollLeft += scrollAmount;
    } else {
      // Mueve a la izquierda
      this.cardsTrack.nativeElement.scrollLeft -= scrollAmount;
    }
  }
}
