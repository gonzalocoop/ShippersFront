import { Talleres } from "./Talleres"
import { Usuarios } from "./Usuarios"

export class Historias{
    id_historia:number=0   
    titulo: string =""            
    texto:string=""
    link_imagen:string=""
    direccion:string=""
    usua:Usuarios=new Usuarios()
    taller:Talleres=new Talleres()
}