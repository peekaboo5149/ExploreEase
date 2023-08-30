import { Inject, Injectable } from '@nestjs/common'
import { RedisClient } from './redis.provider'

@Injectable()
export class RedisService {
    public constructor(
        @Inject('REDIS_CLIENT')
        private readonly client: RedisClient,
    ) {}

    async set(key: string, value: string, expirationSeconds: number) {
        await this.client.set(key, value, 'EX', expirationSeconds)
    }

    async del(key: string) {
        await this.client.del(key)
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key)
    }

    async getRoleName(id: string): Promise<string> {
        const roleName = await this.client.hget('roles', id)
        return roleName || null
    }
}
