type FunctionMap = { [key: string]: (...args: any[]) => any };

export class FunctionCaller {
  private functionMap: FunctionMap = {};

  public registerFunction(name: string, func: (...args: any[]) => any): void {
    this.functionMap[name] = func;
  }

  public callFunction(name: string, ...args: any[]): any {
    const func = this.functionMap[name];
    if (typeof func === "function") {
      return func(...args);
    } else {
      throw new Error(`Function "${name}" not found`);
    }
  }
}
