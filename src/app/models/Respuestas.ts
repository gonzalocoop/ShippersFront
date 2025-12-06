import { Historias } from "./Historias"
import { Usuarios } from "./Usuarios"


export class Respuestas{
    id_respuesta:number=0   
    texto:string=""
    usua:Usuarios=new Usuarios()
    historia:Historias=new Historias()
}