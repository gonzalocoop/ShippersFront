import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { FechasTalleres } from '../../../models/FechasTalleres';
import { Talleres } from '../../../models/Talleres';
import { TalleresService } from '../../../services/talleres.service';
import { FechastalleresService } from '../../../services/fechastalleres.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-registrartalleres',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './registrartalleres.component.html',
  styleUrl: './registrartalleres.component.css'
})
export class RegistrartalleresComponent implements OnInit {

  formTaller!: FormGroup;
  formFechas!: FormGroup;

  idUsuarioLogueado = 0;
  idTallerCreado = 0;

  tallerGuardado = false;

  sumaFechas = 0;
  cuposTaller = 0;
  imagenSeleccionada: File | null = null;
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';
  constructor(
    private fb: FormBuilder,
    private tS: TalleresService,
    private fS: FechastalleresService,
    private uS: UsuariosService,
    private router: Router,
    private lS: LoginService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
    this.role = this.lS.showRole();
    this.formTaller = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      direccion: ['', Validators.required],
      departamento: ['', Validators.required],
      precio: [0, Validators.required],
      duracion: [0, Validators.required],
      cupos_libres: [0, Validators.required],
      dificultad: ['', Validators.required],
    });

    this.formFechas = this.fb.group({
      fechas: this.fb.array([])
    });
  }

  get fechas(): FormArray {
    return this.formFechas.get('fechas') as FormArray;
  }



  onFileSelected(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }


  agregarFecha() {
    const fechaGroup = this.fb.group({
      dia: ['', Validators.required],
      hora: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}:\d{2}$/)]],
      titulo: ['', Validators.required],
      descripcion: [''],
      maximas_personas: [0, Validators.required]
    });

    fechaGroup.valueChanges.subscribe(() => {
      this.calcularSumaFechas();
    });

    this.fechas.push(fechaGroup);
    this.calcularSumaFechas();
  }

  eliminarFecha(i: number) {
    this.fechas.removeAt(i);
    this.calcularSumaFechas();
  }

  calcularSumaFechas() {
    this.sumaFechas = this.fechas.controls
      .map(f => f.get('maximas_personas')?.value || 0)
      .reduce((a, b) => a + b, 0);
  }

  registrarTaller() {
    if (this.formTaller.invalid) return;

    // 1️⃣ Construimos el taller igual que antes
    let nuevoTaller = new Talleres();
    Object.assign(nuevoTaller, this.formTaller.value);
    nuevoTaller.descripcion = nuevoTaller.descripcion.replace(/\r\n/g, '\n'); //BORRAR SI CRASHEA ALGO
    nuevoTaller.usua = { id_usuario: this.idUsuarioLogueado } as any;
    nuevoTaller.activo = false;
    nuevoTaller.calificacion = 0;

    // Guardamos cupos
    this.cuposTaller = this.formTaller.value.cupos_libres;

    // 2️⃣ Preparamos el FormData (taller + imagen)
    const formData = new FormData();

    // envía el JSON como blob con content-type application/json
    const tallerBlob = new Blob([JSON.stringify(nuevoTaller)], { type: 'application/json' });
    formData.append('taller', tallerBlob);

    // imagen (si hay)
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }


    // 3️⃣ Llamamos al insert del service
    this.tS.insert(formData).subscribe(id => {
      this.idTallerCreado = id;
      this.tallerGuardado = true;

      // Igual que antes
      this.agregarFecha();
    });
  }

  guardarFechas() {
    this.calcularSumaFechas();

    if (this.sumaFechas !== this.cuposTaller) {
      alert(`La suma de cupos (${this.sumaFechas}) debe ser igual a ${this.cuposTaller}`);
      return;
    }

    for (let f of this.fechas.value) {
      let fecha = new FechasTalleres();
      fecha.dia = f.dia;
      fecha.hora = f.hora;
      fecha.titulo = f.titulo;
      fecha.descripcion = f.descripcion;
      fecha.maximas_personas = f.maximas_personas;
      fecha.personas_registradas = 0;
      fecha.taller = { id_taller: this.idTallerCreado } as any;

      this.fS.insert(fecha).subscribe();
    }

    alert("Fechas registradas correctamente");
    this.router.navigate(['/talleres']);
  }

  cargarUsuarioLogueado() {
    this.uS.usuarioPorUsername(this.selectedUser).subscribe(user => {
      this.idUsuarioLogueado = user.id_usuario;
    });
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
