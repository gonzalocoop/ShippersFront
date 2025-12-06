import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListarperfilpublicoComponent } from "./listarperfilpublico/listarperfilpublico.component";
@Component({
  selector: 'app-perfilpublico',
  standalone: true,
  imports: [RouterModule, ListarperfilpublicoComponent],
  templateUrl: './perfilpublico.component.html',
  styleUrl: './perfilpublico.component.css'
})
export class PerfilpublicoComponent {
  constructor(public route: ActivatedRoute) {}
}
