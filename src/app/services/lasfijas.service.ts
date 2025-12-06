import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LasFijas } from '../models/LasFijas';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class LasfijasService {

   private url=`${base_url}/lasfijas`
    private listaCambio=new Subject<LasFijas[]>()
    constructor(private http:HttpClient) { }
  
    list(){
      return this.http.get<LasFijas[]>(this.url)
    }
  
    //insert, get y set para el registrar
    insert(cu:LasFijas){
      return this.http.post(this.url,cu);
    }
    //get y set
    getList(){
      return this.listaCambio.asObservable();
    }
  
    setList(listaNueva:LasFijas[]){
      this.listaCambio.next(listaNueva); 
    }
  
    delete(id:number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    listId(id:number){
      return this.http.get<LasFijas>(`${this.url}/${id}`)
    }
    update(d:LasFijas){
      return this.http.put(this.url,d)
    }

    listarFijasFuera():Observable<LasFijas[]>{
    return this.http.get<LasFijas[]>(`${this.url}/fijasfuera`);
  }

  activarFijas(id_fijas: number) {
    const urll = `${this.url}/activarfijas?id_fijas=${id_fijas}`;
    return this.http.put(urll, null);
  }
   desactivarFijas(id_fijas: number) {
    const urll = `${this.url}/desactivarfijas?id_fijas=${id_fijas}`;
    return this.http.put(urll, null);
  }

  fijasSegunUsuario(id_usuario:number):Observable<LasFijas[]>{
    return this.http.get<LasFijas[]>(`${this.url}/fijassegunusuario?id_usuario=${id_usuario}`);
  }
}
