export class InvalidToken extends Error {
  constructor() {
    super("Invalid token");
    this.name = "InvalidToken";
  }
}
