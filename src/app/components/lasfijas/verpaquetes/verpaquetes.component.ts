import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaquetesService } from '../../../services/paquetes.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MistalleresService } from '../../../services/mistalleres.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FechastalleresService } from '../../../services/fechastalleres.service';
import { FechasTalleres } from '../../../models/FechasTalleres';
import { PerfilpublicoService } from '../../../services/perfilpublico.service';

@Component({
  selector: 'app-verpaquetes',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './verpaquetes.component.html',
  styleUrl: './verpaquetes.component.css'
})
export class VerpaquetesComponent implements OnInit {
  idPaquete: number = 0;
  idTaller: number = 0;
  selectedUser: string = localStorage.getItem("username") ?? "";
  idUsuarioLogueado = 0;
  fechas: FechasTalleres[] = [];
  paquete: any = {}; // puedes crear un modelo de Paquete si quieres
  mapaUrl!: SafeResourceUrl;
  perfilPublico: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paquetesService: PaquetesService,
    private misTalleresService: MistalleresService,
    private uS: UsuariosService,
    private sanitizer: DomSanitizer,
    private fechasService: FechastalleresService,
    private pp: PerfilpublicoService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
    this.idPaquete = Number(this.route.snapshot.paramMap.get('id'));
    this.idTaller = Number(this.route.snapshot.paramMap.get('tallerid'));

    // Cargar info del paquete
    this.paquetesService.listId(this.idPaquete).subscribe(paquetedata => {
      this.paquete = paquetedata;
      // AHORA que la dirección existe, generamos el mapa
      const direccion = encodeURIComponent(this.paquete.fijas.taller.direccion);
      const url = `https://www.google.com/maps?q=${direccion}&output=embed`;
      this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

       // cargar perfil público usando el id de este usuario
      this.pp.perfilDeUsuario(this.paquete.fijas.taller.usua.id_usuario).subscribe(perfil => {
        this.perfilPublico = perfil[0]; // viene como array
      });
    });

    // Cargar info de horarios
    this.fechasService.buscarPorIdTaller(this.idTaller).subscribe(data => {
      this.fechas = data;
      this.validarCupos();
      
    });



  }

  validarCupos() {
  //MENSAJE DE PAQUETES LLENOS:
      // Buscar el objeto fecha elegido
      const fechaSeleccionada = this.fechas.find(f =>
        String(f.dia).startsWith(this.paquete.dia) && String(f.hora).startsWith(this.paquete.hora)
      );

      if (!fechaSeleccionada) {
       
        return;
      }


      const totalPersonas = fechaSeleccionada.personas_registradas + this.paquete.cantidad_personas;

      if (totalPersonas > fechaSeleccionada.maximas_personas) {

        const banner = document.createElement("div");
        banner.innerHTML = `
  <div style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    animation: fadeIn 0.5s ease-out;
  ">
    <div style="
      background: linear-gradient(135deg, #ff4b4b, #ff9a3c);
      color: white;
      padding: 40px 60px;
      border-radius: 20px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 12px 35px rgba(0,0,0,0.5);
      animation: pop 0.5s ease-out;
    ">
      <h1 style='font-size: 36px; margin-bottom: 20px;'>❌ ¡Cupos agotados!</h1>
      <p style='font-size: 20px; margin-bottom: 30px;'>
        Máximo permitido: ${fechaSeleccionada.maximas_personas}<br>
        Ya registrados: ${fechaSeleccionada.personas_registradas}<br>
      </p>
      <button style="
        padding: 15px 35px;
        font-size: 20px;
        font-weight: bold;
        background: white;
        color: #ff4b4b;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.2s;
      " onclick="this.parentElement.parentElement.remove();">
        Cerrar
      </button>
    </div>
  </div>

  <style>
    @keyframes pop {
      0% { transform: scale(0.5); opacity: 0; }
      70% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  </style>
`;

        document.body.appendChild(banner);

        return; // IMPORTANTE: no dejar registrar
      }
}

  getImagenUrl(nombreArchivo: string): string {
    return `http://localhost:8081/uploads/${nombreArchivo}`;
  }

  volver() {
    this.router.navigate(['/lasfijas']);
  }

  reservarPaquete() {
    if (this.paquete.fijas.taller.cupos_libres === 0) {
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



    // Buscar el objeto fecha elegido
    const fechaSeleccionada = this.fechas.find(f =>
      String(f.dia).startsWith(this.paquete.dia) && String(f.hora).startsWith(this.paquete.hora)
    );

    if (!fechaSeleccionada) {
      alert("Error: No se encontró el horario seleccionado.");
      return;
    }


    const totalPersonas = fechaSeleccionada.personas_registradas + this.paquete.cantidad_personas;

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
        Intentaste registrar: ${this.paquete.cantidad_personas}
      </span>
    </div>
  `;

      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 3000);

      return; // IMPORTANTE: no dejar registrar
    }









    // EXTRAER FECHA Y HORA

    this.misTalleresService.registrarTallerYActualizarCupos(
      this.paquete.cantidad_personas,  // cantidad
      this.paquete.precio,             // total
      this.paquete.fijas.taller.id_taller,            // id_taller/fija
      this.idUsuarioLogueado,
      this.paquete.dia,
      this.paquete.hora
    ).subscribe({
      next: () => {
        alert("Reserva del paquete registrada con éxito 🎉");
        this.refrescarDatos();
      },
      error: (err) => {
        console.error(err);
        alert("Ocurrió un error al registrar el paquete.");
      }
    });
    this.misTalleresService
      .aumentarCuposEnFechas(
        this.paquete.cantidad_personas,   // cantidad
        this.paquete.fijas.taller.id_taller,              // id_taller
        this.paquete.dia,    // YYYY-MM-DD
        this.paquete.hora     // HH:mm:ss
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

  cargarUsuarioLogueado() {
    if (!this.selectedUser) return;
    this.uS.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
    });
  }

  refrescarDatos() {
    // Volver a cargar los datos del taller
    this.paquetesService.listId(this.idPaquete).subscribe(data => {
      this.paquete = data;
    });

    // Volver a cargar las fechas y sus cupos
    this.fechasService.buscarPorIdTaller(this.idTaller).subscribe(data => {
      this.fechas = data;

    });
  }
}
