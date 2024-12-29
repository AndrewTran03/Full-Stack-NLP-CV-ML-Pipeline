import { Component, Input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Card, DEFAULT_CARD } from "../../shared/models/card.model";
import { CardService } from "../../shared/services/card.service";
import { PythonBE, DEFAULT_PYTHON_BE } from "../../shared/models/python.model";
import { PythonService } from "../../shared/services/python.service";
@Component({
  selector: "app-card",
  imports: [CommonModule],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.css"
})
export class CardComponent {
  @Input() input = "";
  card = signal<Card>(DEFAULT_CARD);
  predict = signal<PythonBE>(DEFAULT_PYTHON_BE);

  constructor(
    private readonly cardService: CardService,
    private readonly pythonService: PythonService
  ) {}

  btnClick() {
    this.cardService.getFilledCard().subscribe((newCard: Card) => {
      // console.log({ newCard });
      this.card.set(newCard);
    });
    this.pythonService.connectToPythonBackendHTTPClient().subscribe((response) => {
      this.predict.set(response);
    });
  }

  getCardText(): string {
    return this.card().text;
  }
}
