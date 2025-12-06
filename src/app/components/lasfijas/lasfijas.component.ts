import { Component } from '@angular/core';
import { ListarlasfijasComponent } from "./listarlasfijas/listarlasfijas.component";
import { LasfijasService } from '../../services/lasfijas.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-lasfijas',
  standalone: true,
  imports: [ListarlasfijasComponent, RouterModule],
  templateUrl: './lasfijas.component.html',
  styleUrl: './lasfijas.component.css'
})
export class LasfijasComponent {
  constructor(private lfS: LasfijasService, public route: ActivatedRoute) {}
}
