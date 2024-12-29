export class PythonBE {
  prediction = "";

  static asPythonBE(content: Partial<PythonBE>): PythonBE {
    const pythonBE: PythonBE = Object.assign(new PythonBE(), content);
    return pythonBE;
  }

  static asPythonBEs(jsonArray: Partial<PythonBE>[]): PythonBE[] {
    return jsonArray.map((pythonBEUnmapped) => PythonBE.asPythonBE(pythonBEUnmapped));
  }

  json(): string {
    return JSON.stringify(this);
  }
}
