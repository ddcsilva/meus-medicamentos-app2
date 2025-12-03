import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Serviço base para comunicação com a API.
 * 
 * Este serviço demonstra como usar as configurações de environment
 * para fazer requisições HTTP à API Node.js.
 * 
 * @example
 * constructor(private api: ApiService) {
 *   this.api.get('/medicamentos').subscribe(data => {
 *     console.log(data);
 *   });
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * URL base da API construída a partir do environment.
   */
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
    
    // Log apenas em desenvolvimento
    if (!environment.production) {
      console.log('API Base URL:', this.baseUrl);
    }
  }

  /**
   * Faz uma requisição GET.
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Faz uma requisição POST.
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Faz uma requisição PUT.
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Faz uma requisição PATCH.
   */
  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * Faz uma requisição DELETE.
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}

