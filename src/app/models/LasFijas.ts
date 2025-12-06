import { Talleres } from "./Talleres"

export class LasFijas{
    id_fijas:number=0   
    titulo: string = ''          // ← aquí va la hora como texto ("HH:mm:ss" o "HH:mm")
    activo:boolean=true
    taller:Talleres=new Talleres()
}