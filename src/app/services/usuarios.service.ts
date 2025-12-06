import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuarios } from '../models/Usuarios';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

   private url=`${base_url}/usuarios`
  private listaCambio=new Subject<Usuarios[]>()
  constructor(private http:HttpClient, private loginService: LoginService) { }

  list(){
    return this.http.get<Usuarios[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(u:Usuarios){
    return this.http.post(this.url,u);
  }
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Usuarios[]) {
    const role = this.loginService.showRole();  // Obtener el rol del usuario
    const username = localStorage.getItem("username") ?? "";  // Obtener el nombre de usuario
  
    if (role === 'ADMINISTRADOR') {
      // Si es admin, pasar todos los videos favoritos
      this.listaCambio.next(listaNueva);
    } else {
      // Si no es admin, filtrar solo los videos del usuario actual
      const filteredList = listaNueva.filter(usuario => usuario.username === username);
      this.listaCambio.next(filteredList);
    }
  }


  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Usuarios>(`${this.url}/${id}`)
  }
  update(u:Usuarios){
    return this.http.put(this.url,u)
  }

  usuarioPorUsername(username: string): Observable<Usuarios> {
    const encodedUsername = encodeURIComponent(username);
    const urll = `${this.url}/usuarioporusername?u=${encodedUsername}`;
    return this.http.get<Usuarios>(urll);
  }

  updateEncript(u:Usuarios){
    const urll = `${this.url}/encript`;
    return this.http.put(urll,u)
  }
}
