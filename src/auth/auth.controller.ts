import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto, RefreshTokenDto, UserDto } from './model/auth.dto'
import { Public } from './auth.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() userDto: UserDto) {
    return this.authService.signIn(userDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout/:userId')
  signOut(
    @Param('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.signOut(userId, refreshToken)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken)
  }
}
