import { Card, Card2, DEFAULT_CARD } from "../models/card.model";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CardService {
  getFilledCard(): Observable<Card> {
    const c: Card = new Card();
    c.text = "DONE";
    c.id = 1;
    return of(c);
  }

  getNewCard2(): Observable<Card2> {
    const c: Card2 = DEFAULT_CARD;
    c.text = "New Card Text";
    c.id = 2;
    return of(c);
  }
}
