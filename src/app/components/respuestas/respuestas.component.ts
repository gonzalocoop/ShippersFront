import { Component } from '@angular/core';
import { ListarrespuestasComponent } from "./listarrespuestas/listarrespuestas.component";
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-respuestas',
  standalone: true,
  imports: [ListarrespuestasComponent,RouterModule],
  templateUrl: './respuestas.component.html',
  styleUrl: './respuestas.component.css'
})
export class RespuestasComponent {
  constructor(public route: ActivatedRoute) {}
}
