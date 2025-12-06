import { LasFijas } from "./LasFijas"

export class Paquetes{
    id_paquetes:number=0   
    cantidad_personas:number=0   
    precio:number=0   
    dia:Date=new Date(Date.now())
    hora: string =""             
    fijas:LasFijas=new LasFijas()
}