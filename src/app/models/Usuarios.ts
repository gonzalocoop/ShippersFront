import { Roles } from "./Roles"


export class Usuarios{
    id_usuario:number=0   
    username:string=""
    password:string=""
    correo:string=""
    nombre_cliente:string=""
    edad:number=0   
    activo:boolean=true
    id_rol:Roles=new Roles()
}