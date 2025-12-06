import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PerfilPublico } from '../models/PerfilPublico';
const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class PerfilpublicoService {

   private url=`${base_url}/perfilpublico`
    private listaCambio=new Subject<PerfilPublico[]>()
    constructor(private http:HttpClient) { }
  
    list(){
      return this.http.get<PerfilPublico[]>(this.url)
    }
  
    //insert, get y set para el registrar
    insert(cu:PerfilPublico){
      return this.http.post(this.url,cu);
    }
    //get y set
    getList(){
      return this.listaCambio.asObservable();
    }
  
    setList(listaNueva:PerfilPublico[]){
      this.listaCambio.next(listaNueva); 
    }
  
    delete(id:number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    listId(id:number){
      return this.http.get<PerfilPublico>(`${this.url}/${id}`)
    }
    update(d:PerfilPublico){
      return this.http.put(this.url,d)
    }

    perfilDeUsuario(id_usuario: number): Observable<PerfilPublico[]> {
                
                const urll = `${this.url}/perfilsegunusuario?id_usuario=${id_usuario}`;
                return this.http.get<PerfilPublico[]>(urll);
            }
}
