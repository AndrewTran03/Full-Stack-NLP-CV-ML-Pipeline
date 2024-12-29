import { Component, Input, OnDestroy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Card } from "../../shared/models/card.model";
import { CardService } from "../../shared/services/card.service";
import { PythonBE } from "../../shared/models/python.model";
import { PythonService } from "../../shared/services/python.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-card",
  imports: [CommonModule],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.css"
})
export class CardComponent implements OnDestroy {
  @Input() input = "";
  private readonly subscriptions: Subscription[] = [];
  card = signal<Card>(new Card());
  predict = signal<PythonBE>(new PythonBE());

  constructor(
    private readonly cardService: CardService,
    private readonly pythonService: PythonService
  ) {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  btnClick() {
    const subscription = this.cardService.getFilledCard().subscribe((newCard: Card) => {
      this.card.set(newCard);
    });
    this.subscriptions.push(subscription);

    const subscription2 = this.pythonService.connectToPythonBackendHTTPClient().subscribe((response) => {
      this.predict.set(response);
    });
    this.subscriptions.push(subscription2);
  }

  getCardText(): string {
    return this.card().text;
  }
}
