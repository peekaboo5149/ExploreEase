import { fetchRolesFromDb, seedRole } from 'prisma/role-seeder'
import { Redis } from 'ioredis'

export default class WebConfig {
    private static instance: WebConfig
    private redisClient: Redis
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        this.redisClient = new Redis(process.env.REDIS_URL)
    }

    static getInstance(): WebConfig {
        if (!WebConfig.instance) {
            WebConfig.instance = new WebConfig()
        }
        return WebConfig.instance
    }

    public async init() {
        await seedRole() // Populate roles
        await this.addRolesToCache()
    }

    private async addRolesToCache() {
        const roles = await fetchRolesFromDb()
        roles.forEach((role) => {
            this.redisClient.hmset('roles', role.id, role.name)
        })
    }
}
