import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Historias } from '../models/Historias';
import { HttpClient } from '@angular/common/http';
const base_url = environment.base
@Injectable({
  providedIn: 'root'
})
export class HistoriasService {

  private url = `${base_url}/historias`
  private listaCambio = new Subject<Historias[]>()
  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Historias[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(formData: FormData): Observable<number> {
  return this.http.post<number>(this.url, formData);
  }
  //get y set
  getList() {
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Historias[]) {
    this.listaCambio.next(listaNueva);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id: number) {
    return this.http.get<Historias>(`${this.url}/${id}`)
  }
  update(d: Historias) {
    return this.http.put(this.url, d)
  }

  historiasdeCreadores(): Observable<Historias[]> {

    const urll = `${this.url}/historiasporcreadores`;
    return this.http.get<Historias[]>(urll);
  }

  historiasdeUsuarios(): Observable<Historias[]> {

    const urll = `${this.url}/historiasporusuarios`;
    return this.http.get<Historias[]>(urll);
  }

  historiasdeAdmins(): Observable<Historias[]> {

    const urll = `${this.url}/historiasporadmins`;
    return this.http.get<Historias[]>(urll);
  }
}
