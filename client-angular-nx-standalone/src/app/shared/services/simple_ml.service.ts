import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, catchError } from "rxjs";
import { APIService } from ".";
import { SimpleML } from "../models/simple_ml.model";

@Injectable({
  providedIn: "root"
})
export class SimpleMLService {
  constructor(private readonly apiService: APIService) {}

  getSimpleMLRequest(): Observable<SimpleML> {
    return this.apiService.post<SimpleML>("api/simple-ml", { message: "This is not a spam email" }).pipe(
      map((res) => {
        console.log(res);
        return res.response;
      }),
      map((res) => SimpleML.asSimpleML(res)),
      catchError((errMsg) => {
        const err = errMsg as HttpErrorResponse as { error: { message: string } };
        console.error("ERROR MSG -", err.error.message);
        alert(err.error.message);
        throw err;
      })
    );
  }
}
