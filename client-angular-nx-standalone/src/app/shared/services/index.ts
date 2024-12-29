import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BACKEND_URL_BASE } from "../utils";
import { Observable } from "rxjs";

type APIResponse<T> = T extends Array<infer U> ? { response: Partial<U>[] } : { response: Partial<T> };

@Injectable({
  providedIn: "root"
})
export class APIService {
  private readonly baseUrl = BACKEND_URL_BASE;
  constructor(private readonly http: HttpClient) {}

  get<T>(endpoint: string): Observable<APIResponse<T>> {
    return this.http.get<APIResponse<T>>(`${this.baseUrl}/${endpoint}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<APIResponse<T>> {
    return this.http.post<APIResponse<T>>(`${this.baseUrl}/${endpoint}`, body, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put<T>(endpoint: string, body: any): Observable<APIResponse<T>> {
    return this.http.put<APIResponse<T>>(`${this.baseUrl}/${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<APIResponse<T>> {
    return this.http.delete<APIResponse<T>>(`${this.baseUrl}/${endpoint}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch<T>(endpoint: string, body: any): Observable<APIResponse<T>> {
    return this.http.patch<APIResponse<T>>(`${this.baseUrl}/${endpoint}`, body);
  }
}
