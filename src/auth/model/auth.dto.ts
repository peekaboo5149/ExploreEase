import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'
import { roles } from '../../global/role'

const rolesName = roles.map((r) => r.name)
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
    @IsEnum(rolesName)
    public role: string

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
