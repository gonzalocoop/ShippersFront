import { Component } from '@angular/core';
import { ListarhistoriasComponent } from "./listarhistorias/listarhistorias.component";
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-historias',
  standalone: true,
  imports: [ListarhistoriasComponent,RouterModule],
  templateUrl: './historias.component.html',
  styleUrl: './historias.component.css'
})
export class HistoriasComponent {
  constructor(public route: ActivatedRoute) {}
}
