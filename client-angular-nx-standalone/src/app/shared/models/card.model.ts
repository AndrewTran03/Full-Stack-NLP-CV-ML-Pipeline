export class Card {
  id = 0;
  text = "";

  static asCard(content: Partial<Card>): Card {
    const card: Card = Object.assign(new Card(), content);
    return card;
  }

  static asCards(jsonArray: Partial<Card>[]): Card[] {
    return jsonArray.map((cardUnmapped) => Card.asCard(cardUnmapped));
  }

  json(): string {
    return JSON.stringify(this);
  }
}

export type Card2 = {
  id: number;
  text: string;
};

export const DEFAULT_CARD: Card2 = {
  id: 0,
  text: ""
};
