import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Usuarios } from '../../models/Usuarios';
import { Roles } from '../../models/Roles';
import { UsuariosService } from '../../services/usuarios.service';
import { RolesService } from '../../services/roles.service';
import {  Router, RouterModule } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegistrarcuentaService } from '../../services/registrarcuenta.service';
import { PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-registrousuarios',
  standalone: true,
  imports: [ MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    RouterModule],
  templateUrl: './registrousuarios.component.html',
  styleUrl: './registrousuarios.component.css'
})
export class RegistrousuariosComponent implements OnInit{
form: FormGroup = new FormGroup({});
  usuario: Usuarios = new Usuarios();
  id: number = 0;
  listaRoles: Roles[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private recS:RegistrarcuentaService
  ) {}

  
  ngOnInit(): void {
    //Para evitar errores por el SesionStorage
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
    }

    this.form = this.formBuilder.group({
      hcodigo: [''], //para el modificar
      husername: ['',[Validators.required, Validators.maxLength(20)],[this.usernameRepetido.bind(this)],],
      hpassword: ['', Validators.required],
      hemail: ['', [Validators.required,Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)]],
      hcliente: ['',[Validators.required, Validators.maxLength(50)]],
      hedad: ['',[Validators.required]],
      hrol: ['', [Validators.required]],
    });
    this.recS.listRoles().subscribe((data) => {
  // Filtrar los roles cuyo nombre sea "EMPRENDEDOR" o "USUARIO"
  this.listaRoles = data.filter(role => role.nombre === 'EMPRENDEDOR' || role.nombre === 'USUARIO');
});
  }

  aceptar() {
    if (this.form.valid) {
      
      this.usuario.username = this.form.value.husername;
      this.usuario.password = this.form.value.hpassword;
      this.usuario.correo = this.form.value.hemail;
      this.usuario.nombre_cliente=this.form.value.hcliente;
      this.usuario.edad=this.form.value.hedad;
      this.usuario.id_rol.id_rol = this.form.value.hrol;
      this.recS.insert(this.usuario).subscribe((data) => {
        this.recS.listUsuarios()
      });
      alert("¡Cuenta creada exitosamente!, ahora inicie sesión");
      this.router.navigate(['iniciosesion']);
    } else {
      // Marca todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
    }
  }

  
  usernameRepetido(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    // Si el campo está vacío, se considera válido
    if (!control.value) {
      return of(null); // Retorna válido si el campo está vacío
    }

    // Llama a la lista de cursos y verifica si hay títulos repetidos
    return this.recS.listUsuarios().pipe(
      map((usuarios) => {
        // Compara títulos y excluye el curso en edición usando this.id
        const existe = usuarios.some(
          (usuario) =>
            usuario.username === control.value && usuario.id_usuario != this.id
        );
        return existe ? { usernameRepetido: true } : null;
      })
    );
  }

  ngAfterViewInit() {
  // Solo ejecutar en navegador
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const canvas: any = document.getElementById('particles-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: any[] = [];
  const colors = ['#FFD700','#FFA500','#FFFFFF'];

  for(let i = 0; i < 150; i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;

      if(p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(animate);
  }

  animate();
}


}
