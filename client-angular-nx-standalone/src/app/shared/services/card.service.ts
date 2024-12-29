import { Card } from "../models/card.model";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CardService {
  getFilledCard(): Observable<Card> {
    const c: Card = new Card();
    c.text = "Filled Card Text";
    c.id = 1;
    return of(c);
  }
}
