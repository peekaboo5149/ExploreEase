import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateUserDto, RefreshTokenDto, UserDto } from './model/auth.dto'
import { EncryptionService } from '../utils/services/encryption/encryption.service'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from 'src/utils/cache/redis.service'

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto
    const foundUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })
    if (foundUser) {
      throw new BadRequestException('User already exist')
    }
    const hashedPassword = await this.encryption.encrypt(password)
    if (!hashedPassword) {
      throw new InternalServerErrorException()
    }
    const { id } = await this.prisma.user.create({
      data: { email, username, password: hashedPassword },
    })

    // Sign jwt: Generate access token and return it
    const accessToken = this.jwtService.sign({ sub: id, username })
    if (!accessToken) {
      // TODO: Add transaction
    }
    return {
      access_token: accessToken,
      id,
      message: 'User created successfully',
    }
  }

  async signIn(userDto: UserDto) {
    const { username, password } = userDto
    const foundUser = await this.prisma.user.findUnique({
      where: { username },
    })
    // validate username and password
    if (
      !foundUser ||
      !(await this.encryption.compare(password, foundUser.password))
    ) {
      throw new UnauthorizedException('Invalid User/Password')
    }

    // sign jwt for access token
    const payload = { sub: foundUser.id, username: foundUser.username }
    const token = await this.jwtService.signAsync(payload)
    if (!token) {
      this.logger.error('Generated empty access token')
      throw new ForbiddenException()
    }

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXP,
    })
    await this.storeRefreshToken(foundUser.id, refreshToken)

    return {
      access_token: token,
      refresh_token: refreshToken,
    }
  }
  private async storeRefreshToken(id: string, refreshToken: string) {
    const exp = this.convertDurationToSeconds(process.env.REFRESH_TOKEN_EXP)
    this.redisService.set(`refreshToken:${id}`, refreshToken, exp)
  }

  private convertDurationToSeconds(durationString: string): number {
    const numericValue = parseInt(durationString)
    if (isNaN(numericValue)) {
      throw new Error('Invalid duration format')
    }

    const unit = durationString[durationString.length - 1].toLowerCase()
    switch (unit) {
      case 's':
        return numericValue
      case 'm':
        return numericValue * 60
      case 'h':
        return numericValue * 60 * 60
      case 'd':
        return numericValue * 24 * 60 * 60
      case 'w':
        return numericValue * 7 * 24 * 60 * 60
      default:
        throw new Error('Invalid duration unit')
    }
  }
  async signOut(userId: string, refreshToken: string) {
    try {
      const storedRefreshToken = await this.redisService.get(
        `refreshToken:${userId}`,
      )
      if (storedRefreshToken !== refreshToken)
        throw new NotFoundException('Invalid refresh token')

      await this.redisService.del(`refreshToken:${userId}`)
      this.logger.log('User signed out succesfully')
      return {
        message: 'User signout successfully',
      }
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to sign out')
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken)
      const userId = payload.sub

      // Check if the refresh token is valid in Redis
      const storedRefreshToken = await this.redisService.get(
        `refreshToken:${userId}`,
      )
      if (storedRefreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      // Generate a new access token
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new UnauthorizedException('Invalid user')
      }

      const newAccessToken = this.jwtService.sign({
        sub: user.id,
        username: user.username,
      })
      if (!newAccessToken) {
        // TODO
      }
      this.logger.log('Refresh token generated succesfully ')
      return {
        access_token: newAccessToken,
      }
    } catch (error) {
      this.logger.error(error)
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
