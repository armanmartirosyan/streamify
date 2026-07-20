export class UserAlreadyExistsException extends Error {
  constructor(field: string) {
    super(`User with the same ${field} already exists`);
    this.name = "UserAlreadyExistsException";
  }
}
