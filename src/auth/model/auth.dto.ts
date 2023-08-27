import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Username has to be atleast between 3 and 20 chars',
  })
  public username: string

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Password has to be atleast between 3 and 20 chars',
  })
  public password: string
}

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Username has to be atleast between 3 and 20 chars',
  })
  public username: string

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Password has to be atleast between 3 and 20 chars',
  })
  public password: string
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}
