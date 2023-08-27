import {
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { IS_PUBLIC_KEY, jwtSecret } from '../utils/constants'
import { Reflector } from '@nestjs/core'
import { RedisService } from 'src/utils/cache/redis.service'

export default class AuthGuard implements CanActivate {
  private logger: Logger = new Logger(AuthGuard.name)
  constructor(
    private jwtService: JwtService,
    @Inject(Reflector) private reflector: Reflector,
    private redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // For public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    this.logger.log('isPublic = ' + isPublic)
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      })
      request['user'] = payload

      // Check if the refresh token is still valid
      const userId = payload.sub
      const storedRefreshToken = await this.redisService.get(
        `refreshToken:${userId}`,
      )
      if (!storedRefreshToken) {
        throw new UnauthorizedException('Refresh token not found')
      }
    } catch (error) {
      this.logger.error(error)
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization']
    if (authHeader) {
      // The Authorization header usually has a value like "Bearer <token>"
      const parts = authHeader.split(' ')
      if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1]
      }
    }
    return undefined // Token not found in header
  }
}
