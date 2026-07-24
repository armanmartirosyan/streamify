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

  type UserDto = {
    id: number;
    email: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    verifiedAt: Date | null;
  }

  type RegisterUserResponse = UserDto & Tokens;

  type Tokens = {
    accessToken: string;
    refreshToken: string;
  };
}
