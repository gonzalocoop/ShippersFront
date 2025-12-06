import { Usuarios } from "./Usuarios"
import { Talleres } from "./Talleres"

export class Comentarios{
    id_comentario:number=0   
    comentario:string=""
    calificacion:number=0  
    usua:Usuarios=new Usuarios()
    taller:Talleres=new Talleres()
}