export namespace Users {
  type CreateUserRequest = {
    name: string;
  };

  type CreateUserRequestResponse = {
    id: number;
    name: string;
  };
}
