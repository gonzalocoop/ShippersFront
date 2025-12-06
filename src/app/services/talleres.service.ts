import { Injectable } from '@angular/core';
import { Talleres } from '../models/Talleres';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base


@Injectable({
  providedIn: 'root'
})
export class TalleresService {

  private url=`${base_url}/talleres`
  private listaCambio=new Subject<Talleres[]>()
  constructor(private http:HttpClient) { }

  list(){
    return this.http.get<Talleres[]>(this.url)
  }

  //insert, get y set para el registrar
 
  insert(formData: FormData): Observable<number> {
  return this.http.post<number>(this.url, formData);
}
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }

  setList(listaNueva:Talleres[]){
    this.listaCambio.next(listaNueva); 
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Talleres>(`${this.url}/${id}`)
  }
  update(d:Talleres){
    return this.http.put(this.url,d)
  }
  registrarEnMisTalleres(id_taller: number,id_usuario: number,cantidad_personas: number): Observable<Talleres[]> {
    
    const urll = `${this.url}/registrarenmistalleres?id_taller=${id_taller}?id_usuario=${id_usuario}?cantidad_personas=${cantidad_personas}`;
    return this.http.get<Talleres[]>(urll);
  }
  
  activarTaller(id_taller: number) {
    const urll = `${this.url}/activartaller?id_taller=${id_taller}`;
    return this.http.put(urll, null);
  }

  desactivarTaller(id_taller: number) {
    const urll = `${this.url}/desactivartaller?id_taller=${id_taller}`;
    return this.http.put(urll, null);
  }

  talleressegunusuario(id_usuario: number): Observable<Talleres[]> {
    
    const urll = `${this.url}/talleressegunusuario?id_usuario=${id_usuario}`;
    return this.http.get<Talleres[]>(urll);
  }
}
