import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Comentarios } from '../models/Comentarios';
import { ComentarioTallerDTO } from '../models/ComentarioTallerDTO';
const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  private url = `${base_url}/comentarios`
  private listaCambio = new Subject<Comentarios[]>()
  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Comentarios[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(co: Comentarios) {
    return this.http.post(this.url, co);
  }
  //get y set
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Comentarios[]) {
    this.listaCambio.next(listaNueva);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<Comentarios>(`${this.url}/${id}`)
  }
  update(d: Comentarios) {
    return this.http.put(this.url, d)
  }

  comentariosSegunTaller(id_taller: number): Observable<ComentarioTallerDTO[]> {

    const urll = `${this.url}/comentariosseguntaller?id_taller=${id_taller}`;
    return this.http.get<ComentarioTallerDTO[]>(urll);
  }

  comentariosSegunUsuario(id_usuario: number): Observable<Comentarios[]> {

    const urll = `${this.url}/comentariossegunusuario?id_usuario=${id_usuario}`;
    return this.http.get<Comentarios[]>(urll);
  }

  actualizarCalificacionDeTodosLosTalleres() {

    const urll = `${this.url}/actualizarcalificaciones`;
    return this.http.put(urll, null);
  }
}
