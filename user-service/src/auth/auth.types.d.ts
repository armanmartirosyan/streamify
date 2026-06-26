export namespace AuthTypes {
  type RegisterUserRequest = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    displayName?: string;
    profilePictureUrl?: string;
  };

  type RegisterUserResponse = {
    id: number;
    email: string;
    username: string;
    displayName?: string;
    tokens: Tokens;
  };

  type Tokens = {
    accessToken: string;
    refreshToken: string;
  };
}
