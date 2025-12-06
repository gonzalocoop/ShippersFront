import { Routes } from '@angular/router';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { TalleresComponent } from './components/talleres/talleres.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { FechastalleresComponent } from './components/fechastalleres/fechastalleres.component';
import { LasfijasComponent } from './components/lasfijas/lasfijas.component';
import { PaquetesComponent } from './components/paquetes/paquetes.component';
import { PerfilpublicoComponent } from './components/perfilpublico/perfilpublico.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { HomeComponent } from './components/home/home.component';
import { IniciosesionComponent } from './components/iniciosesion/iniciosesion.component';
import { RegistrousuariosComponent } from './components/registrousuarios/registrousuarios.component';
import { MicuentaComponent } from './components/micuenta/micuenta.component';
import { ListartalleresComponent } from './components/talleres/listartalleres/listartalleres.component';
import { VerdescripcionComponent } from './components/talleres/verdescripcion/verdescripcion.component';
import { VerpaquetesComponent } from './components/lasfijas/verpaquetes/verpaquetes.component';
import { MistallerescumplidosComponent } from './components/mistallerescumplidos/mistallerescumplidos.component';
import { VertallercunmplidoComponent } from './components/mistallerescumplidos/vertallercunmplido/vertallercunmplido.component';
import { MistalleresfaltantesComponent } from './components/mistalleresfaltantes/mistalleresfaltantes.component';
import { VertallerfaltanteComponent } from './components/mistalleresfaltantes/vertallerfaltante/vertallerfaltante.component';
import { RegistrartalleresComponent } from './components/talleres/registrartalleres/registrartalleres.component';
import { AdminComponent } from './components/admin/admin.component';
import { RegistrarpaquetesComponent } from './components/paquetes/registrarpaquetes/registrarpaquetes.component';
import { FijassinactivarComponent } from './components/fijassinactivar/fijassinactivar.component';
import { RegistrarperfilpublicoComponent } from './components/registrarperfilpublico/registrarperfilpublico.component';
import { HistoriasComponent } from './components/historias/historias.component';
import { RespuestasComponent } from './components/respuestas/respuestas.component';

export const routes: Routes = [

    {
        path: '', // Ruta vacía para redirigir
        redirectTo: '/landing', // Redirige a la página de inicio
        pathMatch: 'full' // Asegúrate de que coincida con toda la ruta
    },
    {
        path: 'landing', component: LandingpageComponent,

    },
    {
        path:'talleres',component:TalleresComponent,
        children:[
            {
                path:'descripcion/:id', component:VerdescripcionComponent
            },
            {
                path:'registrar', component:RegistrartalleresComponent
            }
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'comentarios',component:ComentariosComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'fechastalleres',component:FechastalleresComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'lasfijas',component:LasfijasComponent,
        children:[
           {
                path:'verpaquete/:id/:tallerid', component:VerpaquetesComponent
            },
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'mistallerescumplidos',component:MistallerescumplidosComponent,
        children:[
           {
                path:'vertaller/:id', component:VertallercunmplidoComponent
            },
            
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'mistalleresfaltantes',component:MistalleresfaltantesComponent,
        children:[
           {
                path:'vertaller/:id', component:VertallerfaltanteComponent
            },
            
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'paquetes',component:PaquetesComponent,
        children:[
            {
           path:'registrar', component:RegistrarpaquetesComponent
            },
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'perfilpublico/:id',component:PerfilpublicoComponent,
        children:[
          
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'roles',component:RolesComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'usuarios',component:UsuariosComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'posiblesfijas',component:FijassinactivarComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'micuenta',component:MicuentaComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'admin',component:AdminComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
      path: 'homes',
      component: HomeComponent,
      canActivate: [seguridadGuard], 
    },
    {
        path:'iniciosesion',component:IniciosesionComponent,
    },
    {
        path:'registrarcuenta',component:RegistrousuariosComponent,
    },
    {
        path:'registrarperfilpublico',component:RegistrarperfilpublicoComponent,
    },
    {
        path:'historias',component:HistoriasComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    },
    {
        path:'respuestas',component:RespuestasComponent,
        children:[
           
        ],
        canActivate: [seguridadGuard],
    }
];
