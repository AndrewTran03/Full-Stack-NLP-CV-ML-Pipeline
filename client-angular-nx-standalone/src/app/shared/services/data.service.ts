import { catchError, map, Observable } from "rxjs";
import { APIService } from "./api.service";
import { Data } from "../models/data.model";
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private readonly apiService: APIService) {}

  getQueriedData(queryParams: { age: number; name: string }): Observable<Data[]> {
    // return this.apiService
    //   .get<Data[]>(`api/data?queryParamAge=${queryParams.age}&queryParamName=${queryParams.name}`)
    //   .pipe(
    //     map((res) => {
    //       console.log("Response (Queried):");
    //       console.log(res);
    //       return res.response;
    //     }),
    //     map((res) => Data.asDatas(res)),
    //     catchError((errMsg) => {
    //       const err = errMsg as HttpErrorResponse as { error: { message: string } };
    //       console.error("ERROR MSG -", err.error.message);
    //       alert(err.error.message);
    //       throw err;
    //     })
    //   );
    return this.apiService
      .get<Data[]>(`api/data?queryParamAge=${queryParams.age}&queryParamName=${queryParams.name}`)
      .pipe(
        map((res) => res.response),
        map((responses) => responses.map((response) => ({ ...response, createdAt: new Date(response.createdAt) })))
      );
  }

  getAllData(): Observable<Data[]> {
    return this.apiService.get<Data[]>("api/data").pipe(
      map((res) => {
        console.log("Response:");
        console.log(res);
        return res.response;
      }),
      map((res) => Data.asDatas(res)),
      catchError((errMsg) => {
        const err = errMsg as HttpErrorResponse as { error: { message: string } };
        console.error("ERROR MSG -", err.error.message);
        alert(err.error.message);
        throw err;
      })
    );
  }

  getDataError(): Observable<null> {
    return this.apiService.get<null>("api/data/error").pipe(
      map((res) => {
        console.log("Response:");
        console.log(res);
        return res.response;
      }),
      catchError((err) => {
        const error = err as HttpErrorResponse as { error: { message: string } };
        console.error("ERROR MSG -", error.error.message);
        alert(err.error.message);
        throw err;
      })
    );
  }

  getSpecifiedData(pathParams: { age: number; name: string }): Observable<Data> {
    return this.apiService.get<Data>(`api/data/${pathParams.age}/${pathParams.name}`).pipe(
      map((res) => {
        console.log("Response (Specified):");
        console.log(res);
        return res.response;
      }),
      map((res) => Data.asData(res)),
      catchError((errMsg) => {
        const err = errMsg as HttpErrorResponse as { error: { message: string } };
        console.error("ERROR MSG -", err.error.message);
        alert(err.error.message);
        throw err;
      })
    );
  }
}
