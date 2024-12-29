import { map, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { PythonBE } from "../models/python.model";
import { Injectable } from "@angular/core";
import { APIService } from ".";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PythonService {
  constructor(private readonly apiService: APIService) {}

  connectToPythonBackendHTTPClient(): Observable<PythonBE> {
    return this.apiService.post<PythonBE>(`api/python`, { message: "Python" }).pipe(
      map((res) => {
        console.log(res);
        return res.response;
      }),
      map((res) => PythonBE.asPythonBE(res)),
      catchError((errMsg) => {
        const err = errMsg as HttpErrorResponse as { error: { message: string } };
        console.error("ERROR MSG -", err.error.message);
        alert(err.error.message);
        throw err;
      })
    );
  }
}
