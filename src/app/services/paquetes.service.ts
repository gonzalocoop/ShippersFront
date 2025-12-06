import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Paquetes } from '../models/Paquetes';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

   private url=`${base_url}/paquetes`
    private listaCambio=new Subject<Paquetes[]>()
    constructor(private http:HttpClient) { }
  
    list(){
      return this.http.get<Paquetes[]>(this.url)
    }
  
    //insert, get y set para el registrar
    insert(cu:Paquetes){
      return this.http.post(this.url,cu);
    }
    //get y set
    getList(){
      return this.listaCambio.asObservable();
    }
  
    setList(listaNueva:Paquetes[]){
      this.listaCambio.next(listaNueva); 
    }
  
    delete(id:number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    listId(id:number){
      return this.http.get<Paquetes>(`${this.url}/${id}`)
    }
    update(d:Paquetes){
      return this.http.put(this.url,d)
    }

    paquetesSegunFijas(id_fijas: number): Observable<Paquetes[]> {
            
            const urll = `${this.url}/paquetessegunfijas?id_fijas=${id_fijas}`;
            return this.http.get<Paquetes[]>(urll);
        }
  
}
