import { Usuarios } from "./Usuarios"


export class PerfilPublico{
    id_perfil:number=0   
    nombre: string = '';   
    descripcion: string = '';   
    edad:number=0   
    cantidad_talleres:number=0   
    usua:Usuarios=new Usuarios()
}