import { IsEmail, IsString, Length, IsOptional } from "class-validator";

export class RegistrationUserDto {
  @IsEmail({}, { message: "Invalid email address" })
  @Length(5, 255, { message: "Email must be between 5 and 255 characters" })
  email!: string;

  @IsString({ message: "Username must be a string" })
  @Length(3, 30, { message: "Username must be between 3 and 30 characters" })
  username!: string;

  @IsString({ message: "Password must be a string" })
  @Length(8, 255, { message: "Password must be between 8 and 255 characters" })
  password!: string;

  @IsString({ message: "Password must be a string" })
  @Length(8, 255, { message: "Password must be between 8 and 255 characters" })
  confirmPassword!: string;

  @IsOptional()
  @IsString({ message: "Display name must be a string" })
  @Length(3, 30, { message: "Display name must be between 3 and 30 characters" })
  displayName!: string;
}
