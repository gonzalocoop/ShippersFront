import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TalleresService } from '../../../services/talleres.service';
import { Talleres } from '../../../models/Talleres';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FechasTalleres } from '../../../models/FechasTalleres';
import { FechastalleresService } from '../../../services/fechastalleres.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MistalleresService } from '../../../services/mistalleres.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { PerfilpublicoService } from '../../../services/perfilpublico.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Comentarios } from '../../../models/Comentarios';
import { ComentariosService } from '../../../services/comentarios.service';
import { ComentarioTallerDTO } from '../../../models/ComentarioTallerDTO';


@Component({
  selector: 'app-verdescripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './verdescripcion.component.html',
  styleUrl: './verdescripcion.component.css',


})
export class VerdescripcionComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  comentario: Comentarios = new Comentarios();

  selectedUser: string = localStorage.getItem("username") ?? "";
  idUsuarioLogueado = 0;
  taller: Talleres = new Talleres();
  id: number = 0;

  participantes: number = 1;
  total: number = 0;

  comentarios: ComentarioTallerDTO[] = [];
  comentariosPaginados: ComentarioTallerDTO[] = [];
  paginaActual: number = 1;
  itemsPorPagina: number = 5; // cantidad por página
  // << NUEVO >>
  fechas: FechasTalleres[] = [];
  horarios: string[] = [];
  horarioSeleccionado = '';
  mapaUrl!: SafeResourceUrl;
  perfilPublico: any = null;
  comentarioRegistrado = false;

  constructor(
    private route: ActivatedRoute,
    private talleresService: TalleresService,
    private fechasService: FechastalleresService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private misTalleresService: MistalleresService,
    private uS: UsuariosService,
    private pp: PerfilpublicoService,
    private comentarioService: ComentariosService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarUsuarioLogueado();

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerComentarios();
    // Cargar info del taller
    this.talleresService.listId(this.id).subscribe(data => {
      this.taller = data;
      this.total = this.taller.precio;


      // cargar perfil público usando el id de este usuario
      this.pp.perfilDeUsuario(this.taller.usua.id_usuario).subscribe(perfil => {
        this.perfilPublico = perfil[0]; // viene como array
      });



      // AHORA que la dirección existe, generamos el mapa
      const direccion = encodeURIComponent(this.taller.direccion);
      const url = `https://www.google.com/maps?q=${direccion}&output=embed`;

      this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    });

    // Cargar fechas reales del taller
    this.fechasService.buscarPorIdTaller(this.id).subscribe(data => {
      this.fechas = data;

      // Extraer las horas disponibles
      this.horarios = this.fechas.map(f => {
        // f.dia viene como YYYY-MM-DD
        // f.hora viene como HH:mm:ss
        return `${f.dia} — ${f.hora}`;
      });

      // Setear primera hora por defecto
      if (this.horarios.length > 0) {
        this.horarioSeleccionado = this.horarios[0];
      }
    });



    this.form = this.fb.group({
      hcomentario: ['', Validators.required],
      hcalificacion: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });

  }



  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Asignar valores
    this.comentario.comentario = this.form.value.hcomentario;
    this.comentario.calificacion = this.form.value.hcalificacion;
    this.comentario.usua.id_usuario = this.idUsuarioLogueado;
    this.comentario.taller.id_taller = this.id;

    // Insertar
    this.comentarioService.insert(this.comentario).subscribe(() => {
      // 🔥 Actualizar la lista de comentarios inmediatamente
      this.obtenerComentarios();
      this.comentarioService.list().subscribe(lista => {
        this.comentarioService.setList(lista);
        this.comentarioRegistrado = true; // ← mostrar modal
        this.form.reset({
          hcomentario: '',
          hcalificacion: 1
        });
      });
    });

  }

  cerrarModal() {
    this.comentarioRegistrado = false;
  }

  cambiarParticipantes(n: number) {
    const nuevoValor = this.participantes + n;

    if (nuevoValor < 1) return;


    if (nuevoValor > this.taller.cupos_libres) {
      alert(`Solo quedan ${this.taller.cupos_libres} cupos disponibles.`);
      return;
    }

    this.participantes = nuevoValor;
    this.total = this.participantes * this.taller.precio;
  }


  getImagenUrl(nombreArchivo: string): string {
    return `http://localhost:8081/uploads/${nombreArchivo}`;
  }

  reservar() {
    if (this.taller.cupos_libres === 0) {
      // Mensaje colorido y dinámico
      const banner = document.createElement("div");
      banner.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff4b4b, #ff9a3c);
        color: white;
        padding: 18px 30px;
        border-radius: 14px;
        font-size: 20px;
        font-weight: 700;
        box-shadow: 0 8px 25px rgba(0,0,0,0.25);
        z-index: 99999;
        animation: pop 0.4s ease-out;
      ">
        ❌ ¡Cupos agotados!  
        <span style="font-weight:400; font-size:16px; display:block; margin-top:5px;">
          Este taller ya no tiene espacios disponibles 😥
        </span>
      </div>
    `;

      document.body.appendChild(banner);

      // remover el mensaje después de 3 segundos
      setTimeout(() => banner.remove(), 3000);

      return;
    }
    if (!this.idUsuarioLogueado) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }
    // Validación de cupos ANTES de enviar al backend
    //if (this.participantes > this.taller.cupos_libres) {
    //  alert(`No hay suficientes cupos. Solo quedan ${this.taller.cupos_libres}.`);
    //  return;
    //}

    const partes = this.horarioSeleccionado.split(" — ");
    const diaReal = partes[0];    // "2025-11-21"
    const horaReal = partes[1];   // "15:14:35"


    // Buscar el objeto fecha elegido
    const fechaSeleccionada = this.fechas.find(f =>
      String(f.dia).startsWith(diaReal) && String(f.hora).startsWith(horaReal)
    );

    if (!fechaSeleccionada) {
      alert("Error: No se encontró el horario seleccionado.");
      return;
    }


    const totalPersonas = fechaSeleccionada.personas_registradas + this.participantes;

    if (totalPersonas > fechaSeleccionada.maximas_personas) {

      const banner = document.createElement("div");
      banner.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ff4b4b, #ff9a3c);
      color: white;
      padding: 18px 30px;
      border-radius: 14px;
      font-size: 18px;
      font-weight: 700;
      box-shadow: 0 8px 25px rgba(0,0,0,0.25);
      z-index: 99999;
      animation: pop 0.4s ease-out;
    ">
      ❌ No hay cupos suficientes
      <span style="font-weight:400; font-size:16px; display:block; margin-top:5px;">
        Máximo permitido: ${fechaSeleccionada.maximas_personas}<br>
        Ya registrados: ${fechaSeleccionada.personas_registradas}<br>
        Intentaste registrar: ${this.participantes}
      </span>
    </div>
  `;

      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 3000);

      return; // IMPORTANTE: no dejar registrar
    }


    this.misTalleresService
      .registrarTallerYActualizarCupos(
        this.participantes,   // cantidad
        this.total,           // TOTAL calculado
        this.id,              // id_taller
        this.idUsuarioLogueado, // id_usuario REAL
        diaReal,     // YYYY-MM-DD
        horaReal     // HH:mm:ss
      )
      .subscribe({
        next: () => {
          alert("Reserva registrada con éxito 🎉");
          this.refrescarDatos();
          this.participantes = 1;
        },
        error: (err) => {
          console.error("Error al registrar:", err);
          alert("Ocurrió un error al intentar reservar.");
        }
      });

    this.misTalleresService
      .aumentarCuposEnFechas(
        this.participantes,   // cantidad
        this.id,              // id_taller
        diaReal,     // YYYY-MM-DD
        horaReal     // HH:mm:ss
      )
      .subscribe({
        next: () => {
        },
        error: (err) => {
          console.error("Error al registrar, cupos llenos en este horario:", err);
          alert("Ocurrió un error al intentar reservar.");
        }
      });
  }


  volver() {
    this.router.navigate(['/talleres']);
  }

  cargarUsuarioLogueado() {
    this.uS.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
    });
  }

  refrescarDatos() {
    // Volver a cargar los datos del taller
    this.talleresService.listId(this.id).subscribe(data => {
      this.taller = data;
      this.total = this.participantes * this.taller.precio;
    });

    // Volver a cargar las fechas y sus cupos
    this.fechasService.buscarPorIdTaller(this.id).subscribe(data => {
      this.fechas = data;

      // Reconstruir horarios
      this.horarios = this.fechas.map(f => `${f.dia} — ${f.hora}`);

      // Mantener la selección si existe en la nueva lista
      if (this.horarios.includes(this.horarioSeleccionado)) {
        // no hacer nada
      } else if (this.horarios.length > 0) {
        // seleccionar el primero si el anterior ya no existe
        this.horarioSeleccionado = this.horarios[0];
      }
    });
  }



  obtenerComentarios() {
    this.comentarioService.comentariosSegunTaller(this.id).subscribe(data => {
      this.comentarios = data;
      this.actualizarPaginacion();
    });
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.comentariosPaginados = this.comentarios.slice(inicio, fin);
  }

  paginaSiguiente() {
    if ((this.paginaActual * this.itemsPorPagina) < this.comentarios.length) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }
}
