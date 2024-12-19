import { Card, DEFAULT_CARD } from "../models/card.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CardService {
  constructor(private readonly httpClient: HttpClient) {}

  getFilledCard(): Observable<Card> {
    const c: Card = {
      ...DEFAULT_CARD,
      id: 1
    };
    return of(c);
  }
}
