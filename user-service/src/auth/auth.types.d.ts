import type { User } from "@/users/entities/user.entity";

export namespace AuthTypes {
  type RegisterUserRequest = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    displayName?: string;
    profilePictureUrl?: string;
  };

  type RegisterUserResponse = User & Tokens;

  type Tokens = {
    accessToken: string;
    refreshToken: string;
  };
}
