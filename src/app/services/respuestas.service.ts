import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Respuestas } from '../models/Respuestas';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base
@Injectable({
  providedIn: 'root'
})
export class RespuestasService {

  private url = `${base_url}/respuestas`
  private listaCambio = new Subject<Respuestas[]>()
  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Respuestas[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(cu: Respuestas) {
    return this.http.post(this.url, cu);
  }
  //get y set
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Respuestas[]) {
    this.listaCambio.next(listaNueva);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<Respuestas>(`${this.url}/${id}`)
  }
  update(d: Respuestas) {
    return this.http.put(this.url, d)
  }

  respuestasPorHistorias(id_historia: number): Observable<Respuestas[]> {

    const urll = `${this.url}/respuestasporhistorias?id_historia=${id_historia}`;
    return this.http.get<Respuestas[]>(urll);
  }
}
