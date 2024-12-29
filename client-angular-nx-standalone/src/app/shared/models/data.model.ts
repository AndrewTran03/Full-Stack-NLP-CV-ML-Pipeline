export class Data {
  name = "";
  age = 0;
  createdAt: Date = new Date();

  static asData(content: Partial<Data>): Data {
    const data: Data = Object.assign(new Data(), content);
    if (content.createdAt) {
      data.createdAt = new Date(content.createdAt);
    }
    return data;
  }

  static asDatas(jsonArray: Partial<Data>[]): Data[] {
    return jsonArray.map((dataUnmapped) => Data.asData(dataUnmapped));
  }

  json(): string {
    return JSON.stringify(this);
  }
}
