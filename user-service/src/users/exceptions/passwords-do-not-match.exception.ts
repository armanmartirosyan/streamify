export class PasswordsDoNotMatchException extends Error {
  constructor() {
    super("Passwords do not match");
    this.name = "PasswordsDoNotMatchException";
  }
}
