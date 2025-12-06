import { Talleres } from "./Talleres"

export class FechasTalleres{
    id_fecha:number=0   
    dia:Date=new Date(Date.now())
    hora: string =""             // ← aquí va la hora como texto ("HH:mm:ss" o "HH:mm")
    titulo:string=""
    descripcion:string=""
    maximas_personas:number=0 
    personas_registradas:number=0 
    taller:Talleres=new Talleres()
}