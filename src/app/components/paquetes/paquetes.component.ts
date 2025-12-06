import { Component } from '@angular/core';
import { RegistrarpaquetesComponent } from "./registrarpaquetes/registrarpaquetes.component";
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-paquetes',
  standalone: true,
  imports: [RegistrarpaquetesComponent,RouterModule],
  templateUrl: './paquetes.component.html',
  styleUrl: './paquetes.component.css'
})
export class PaquetesComponent {
constructor( public route: ActivatedRoute) {}
}
