import { Component } from '@angular/core';
import { ListarcomentariosComponent } from "./listarcomentarios/listarcomentarios.component";
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [ListarcomentariosComponent, RouterModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  constructor( public route: ActivatedRoute) {}
}
