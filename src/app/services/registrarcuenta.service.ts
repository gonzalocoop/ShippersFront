import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../models/Usuarios';
import { Roles } from '../models/Roles';


const base_url=environment.base


@Injectable({
  providedIn: 'root'
})
export class RegistrarcuentaService {

  private url=`${base_url}/registrarcuenta`
  constructor(private http:HttpClient) { }




  listUsuarios(){
    const urll=`${this.url}/listarusuarios`
    return this.http.get<Usuarios[]>(urll)
  }


  insert(u:Usuarios){
    return this.http.post(this.url,u);
  }

  listRoles(){
    const urll=`${this.url}/listarroles`
    return this.http.get<Roles[]>(urll);
  }



}
