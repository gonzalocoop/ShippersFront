import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwtRequest';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(request: JwtRequest) {
    return this.http.post('http://localhost:8081/login', request);
  }

  verificar() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      let token = sessionStorage.getItem('token');
      return token != null;
    }
    return false; // En SSR no hay acceso a sessionStorage
  }

  showRole() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      let token = sessionStorage.getItem('token');
      if (!token) {
        return null; // Si no hay token, retorna null o lo que prefieras
      }
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken?.role;
    }
    return null; // En SSR, no se puede acceder a sessionStorage
  }
}