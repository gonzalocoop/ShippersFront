import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MisTalleres } from '../models/MisTalleres';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base

@Injectable({
  providedIn: 'root'
})
export class MistalleresService {

  private url = `${base_url}/mistalleres`
  private listaCambio = new Subject<MisTalleres[]>()
  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<MisTalleres[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(cu: MisTalleres) {
    return this.http.post(this.url, cu);
  }
  //get y set
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: MisTalleres[]) {
    this.listaCambio.next(listaNueva);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<MisTalleres>(`${this.url}/${id}`)
  }
  update(d: MisTalleres) {
    return this.http.put(this.url, d)
  }

  registrarTallerYActualizarCupos(cantidad: number, precio: number, id_taller: number, id_usuario: number, dia: string, hora: string) {
    const urll = `${this.url}/registrarenmistalleres?cantidad=${cantidad}&precio=${precio}&id_taller=${id_taller}&id_usuario=${id_usuario}&dia=${dia}&hora=${hora}`;
    return this.http.post(urll, null);
  }

  aumentarCuposEnFechas(cantidad: number, id_taller: number, dia: string, hora: string) {
    const urll = `${this.url}/actualizarcuposfechas?cantidad=${cantidad}&id_taller=${id_taller}&dia=${dia}&hora=${hora}`;
    return this.http.post(urll, null);
  }

  misTalleresSegunUsuario(id_usuario: number): Observable<MisTalleres[]> {

    const urll = `${this.url}/mistallerusuario?id_usuario=${id_usuario}`;
    return this.http.get<MisTalleres[]>(urll);
  }

  completartaller(id_mitaller: number) {
    const urll = `${this.url}/completartaller?id_mis_talleres=${id_mitaller}`;
    return this.http.put(urll, null);
  }
}
