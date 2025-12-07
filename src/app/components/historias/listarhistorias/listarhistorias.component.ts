import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Historias } from '../../../models/Historias';
import { Respuestas } from '../../../models/Respuestas';
import { HistoriasService } from '../../../services/historias.service';
import { RespuestasService } from '../../../services/respuestas.service';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarhistorias',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
  ReactiveFormsModule],
  templateUrl: './listarhistorias.component.html',
  styleUrl: './listarhistorias.component.css'
})
export class ListarhistoriasComponent implements OnInit {

  selectedUser: string = localStorage.getItem("username") ?? "";
  idUsuarioLogueado = 0;

  opcionSeleccionada = "";
  historias: Historias[] = [];
  respuestas: Respuestas[] = [];

  historiaSeleccionada: number | null = null;
  role: string = '';
  formHistoria!: FormGroup;
  selectedImageFile: File | null = null;

  nuevaRespuesta: string = "";

  constructor(
    private fb: FormBuilder,
    private uS: UsuariosService,
    private hS: HistoriasService,
    private rS: RespuestasService,
    private lS: LoginService
  ) {}

  ngOnInit(): void {
    // Primero verificamos sesión
    this.role = this.lS.showRole();
    this.cargarUsuarioLogueado();
    this.crearFormularioHistoria();

    // Cargar historias de usuarios por defecto
    this.opcionSeleccionada = "usuarios";
    this.cargarUsuarios();
  }

  crearFormularioHistoria() {
    this.formHistoria = this.fb.group({
      titulo: ['', Validators.required],
      texto: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  cargarUsuarioLogueado() {
    if (!this.selectedUser) return;
    this.uS.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
    });
  }

  cargarAdmins() {
    this.opcionSeleccionada = "admins";
    this.hS.historiasdeAdmins().subscribe(data => this.historias = data);
  }

  cargarCreadores() {
    this.opcionSeleccionada = "creadores";
    this.hS.historiasdeCreadores().subscribe(data => this.historias = data);
  }

  cargarUsuarios() {
    this.opcionSeleccionada = "usuarios";
    this.hS.historiasdeUsuarios().subscribe(data => this.historias = data);
  }

  // ---------------- HISTORIAS ----------------

  onFileSelected(event: any) {
    this.selectedImageFile = event.target.files[0] ?? null;
  }

  registrarHistoria() {

    if (this.formHistoria.invalid || !this.selectedImageFile) {
      alert("Completa todos los campos e incluye una imagen.");
      return;
    }

    // Construir objeto historia para convertir a JSON
    const nuevaHistoria = {
      titulo: this.formHistoria.value.titulo,
      texto: this.formHistoria.value.texto,
      direccion: this.formHistoria.value.direccion,
      usua: { id_usuario: this.idUsuarioLogueado }
    };

    // Crear FormData
    const formData = new FormData();

    // Agregar JSON como Blob
    const historiaBlob = new Blob(
      [JSON.stringify(nuevaHistoria)],
      { type: "application/json" }
    );

    formData.append("historia", historiaBlob);

    // Agregar archivo de imagen
    formData.append(
      "imagen",
      this.selectedImageFile,
      this.selectedImageFile.name
    );

    // Enviar al backend
    this.hS.insert(formData).subscribe({
      next: () => {
        alert("Historia registrada correctamente");

        this.formHistoria.reset();
        this.selectedImageFile = null;

        // Refrescar tipo de historia actual
        if (this.opcionSeleccionada === "admins") this.cargarAdmins();
        if (this.opcionSeleccionada === "creadores") this.cargarCreadores();
        if (this.opcionSeleccionada === "usuarios") this.cargarUsuarios();
      },
      error: err => {
        console.error(err);
        alert("Error al registrar la historia");
      }
    });
  }

  // ---------------- RESPUESTAS ----------------

  toggleRespuestas(id_historia: number) {
    if (this.historiaSeleccionada === id_historia) {
      this.historiaSeleccionada = null;
      return;
    }

    this.historiaSeleccionada = id_historia;
    this.cargarRespuestas(id_historia);
  }

  cargarRespuestas(id: number) {
    this.rS.respuestasPorHistorias(id).subscribe(data => {
      this.respuestas = data;
    });
  }

  registrarRespuesta(id_historia: number) {
    const r = new Respuestas();
    r.texto = this.nuevaRespuesta;
    r.usua.id_usuario = this.idUsuarioLogueado;
    r.historia.id_historia = id_historia;

    this.rS.insert(r).subscribe(() => {
      this.nuevaRespuesta = "";
      this.cargarRespuestas(id_historia);
    });
  }

  getImagenUrl(nombreArchivo: string): string {
    return `https://shipperapp.azurewebsites.net/uploads/${nombreArchivo}`;
  }

  verificar() {
    this.role = this.lS.showRole();
    return this.lS.verificar();
  }
  isAdmin() {
    return this.role === 'ADMINISTRADOR';
  }

  isUser() {
    return this.role === 'USUARIO';
  }

  isEmprender() {
    return this.role === 'EMPRENDEDOR';
  }
}
