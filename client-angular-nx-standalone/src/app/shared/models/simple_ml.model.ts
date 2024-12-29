export class SimpleML {
  prediction = "";

  static asSimpleML(content: Partial<SimpleML>): SimpleML {
    const simpleML: SimpleML = Object.assign(new SimpleML(), content);
    return simpleML;
  }

  static asSimpleMLs(jsonArray: Partial<SimpleML>[]): SimpleML[] {
    return jsonArray.map((simpleMLUnmapped) => SimpleML.asSimpleML(simpleMLUnmapped));
  }

  json(): string {
    return JSON.stringify(this);
  }
}
