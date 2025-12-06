import { Usuarios } from "./Usuarios"


export class Talleres{
    id_taller:number=0
    titulo:string=""
    descripcion:string=""
    link_imagen:string=""
    categoria:string=""
    direccion:string=""
    departamento:string=""
    precio:number=0
    duracion:number=0
    cupos_libres:number=0
    dificultad:string=""
    calificacion:number=0 
    activo:boolean=true
    usua:Usuarios=new Usuarios()
}