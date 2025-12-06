import { Usuarios } from "./Usuarios"
import { Talleres } from "./Talleres"

export class MisTalleres{
    id_mis_talleres:number=0   
    cantidad_personas:number=0   
    precio:number=0   
    completado:boolean=true
    dia:Date=new Date(Date.now())
    hora: string =""             
    taller:Talleres=new Talleres()
    usua:Usuarios=new Usuarios()
}