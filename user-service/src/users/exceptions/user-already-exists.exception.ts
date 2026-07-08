export class UserAlreadyExistsException extends Error {
  constructor(message = "User with the same email or username already exists") {
    super(message);
    this.name = "UserAlreadyExistsException";
  }
}
