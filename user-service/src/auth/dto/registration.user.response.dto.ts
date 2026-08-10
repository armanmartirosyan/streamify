import { Exclude, Expose } from "class-transformer";

@Exclude()
export class RegistrationUserResponseDto {
  @Expose()
  id!: number;

  @Expose()
  email!: string;

  @Expose()
  username!: string;

  @Expose()
  displayName!: string | null;

  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;

  constructor(partial: RegistrationUserResponseDto) {
    Object.assign(this, partial);
  }
}
