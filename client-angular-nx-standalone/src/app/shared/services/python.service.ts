import { BACKEND_URL_BASE } from "../utils";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { PythonBE } from "../models/python.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PythonService {
  constructor(private readonly httpClient: HttpClient) {}

  connectToPythonBackendHTTPClient(): Observable<PythonBE> {
    return this.httpClient.post<string>(`${BACKEND_URL_BASE}/api/python`, { message: "Python" }).pipe(
      map((response) => {
        console.log(`Response:`, response); // Logs the response string
        console.log(typeof response);
        const parsedResponse = JSON.parse(response) as PythonBE; // Parse the response string
        console.log(`Response:`, parsedResponse); // Logs the parsed response object
        return parsedResponse; // Return the response object directly
      }),
      catchError((error) => {
        console.error("Error fetching data:", error);
        throw error;
      })
    );
  }
}
