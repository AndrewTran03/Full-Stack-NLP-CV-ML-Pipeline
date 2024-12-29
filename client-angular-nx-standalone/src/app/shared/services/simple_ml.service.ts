import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, catchError } from "rxjs";
import { APIService } from ".";

@Injectable({
  providedIn: "root"
})
export class SimpleMLService {
  constructor(private readonly apiService: APIService) {}

  getSimpleMLRequest(): Observable<string> {
    return this.apiService.post<string>("api/simple-ml", { message: "Testing ML..." }).pipe(
      map((res) => {
        console.log(res);
        return res.response;
      }),
      catchError((errMsg) => {
        const err = errMsg as HttpErrorResponse as { error: { message: string } };
        console.error("ERROR MSG -", err.error.message);
        alert(err.error.message);
        throw err;
      })
    );
  }
}
