import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilPublico } from '../../../models/PerfilPublico';
import { PerfilpublicoService } from '../../../services/perfilpublico.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-listarperfilpublico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listarperfilpublico.component.html',
  styleUrl: './listarperfilpublico.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ListarperfilpublicoComponent implements OnInit{
  perfil?: PerfilPublico;

  constructor(
    private route: ActivatedRoute,
    private perfilService: PerfilpublicoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.perfilService.perfilDeUsuario(id)
      .subscribe(res => {
        // Tu API devuelve un array, tomo el primero
        this.perfil = res[0];
      });
  }

  volver() {
    this.router.navigate(['/homes']);
  }
}
