import { Component } from '@angular/core';
import { ListartallerescumplidosComponent } from "./listartallerescumplidos/listartallerescumplidos.component";
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mistallerescumplidos',
  standalone: true,
  imports: [ListartallerescumplidosComponent, RouterModule],
  templateUrl: './mistallerescumplidos.component.html',
  styleUrl: './mistallerescumplidos.component.css'
})
export class MistallerescumplidosComponent {
   constructor(public route: ActivatedRoute) {}
}
