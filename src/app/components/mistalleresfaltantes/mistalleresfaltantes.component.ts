import { Component, OnInit } from '@angular/core';
import { ListartalleresfaltantesComponent } from "./listartalleresfaltantes/listartalleresfaltantes.component";
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mistalleresfaltantes',
  standalone: true,
  imports: [ListartalleresfaltantesComponent, RouterModule],
  templateUrl: './mistalleresfaltantes.component.html',
  styleUrl: './mistalleresfaltantes.component.css'
})
export class MistalleresfaltantesComponent {
    constructor(public route: ActivatedRoute) {}
}
