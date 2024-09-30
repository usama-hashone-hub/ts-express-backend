type AsyncFunction = () => Promise<any>;

export class HelperPromise {
  private functions: AsyncFunction[] = [];

  public register(func: AsyncFunction): void {
    this.functions.push(func);
  }

  public async executeAll(): Promise<void> {
    for (const func of this.functions) {
      try {
        await func();
      } catch (error) {
        console.error("Error executing function:", error);
      }
    }
  }
}
