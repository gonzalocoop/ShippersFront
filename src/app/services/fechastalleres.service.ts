import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FechasTalleres } from '../models/FechasTalleres';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class FechastalleresService {

   private url=`${base_url}/fechastalleres`
    private listaCambio=new Subject<FechasTalleres[]>()
    constructor(private http:HttpClient) { }
  
    list(){
      return this.http.get<FechasTalleres[]>(this.url)
    }
  
    //insert, get y set para el registrar
    insert(cu:FechasTalleres){
      return this.http.post(this.url,cu);
    }
    //get y set
    getList(){
      return this.listaCambio.asObservable();
    }
  
    setList(listaNueva:FechasTalleres[]){
      this.listaCambio.next(listaNueva); 
    }
  
    delete(id:number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    listId(id:number){
      return this.http.get<FechasTalleres>(`${this.url}/${id}`)
    }
    update(d:FechasTalleres){
      return this.http.put(this.url,d)
    }
    buscarPorIdTaller(id_taller: number): Observable<FechasTalleres[]> {
        
        const urll = `${this.url}/fechasportalleres?id_taller=${id_taller}`;
        return this.http.get<FechasTalleres[]>(urll);
    }
}
