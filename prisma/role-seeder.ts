import { roles } from '../src/global/role'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function seedRoles$() {
    const start = Date.now()
    for (const role of roles) {
        const existingRole = await prisma.role.findUnique({
            where: { name: role.name },
        })

        if (!existingRole) {
            await prisma.role.create({
                data: {
                    name: role.name,
                    description: role.description,
                },
            })
            console.log(`Creating role ${role.name}`)
        }
    }
    console.log('Time taken to create or find roles in ms', Date.now() - start)
}

export async function fetchRolesFromDb(): Promise<Role[]> {
    try {
        const roles = await prisma.role.findMany()
        return roles
    } catch (error) {
        throw new Error('Error fetching roles from the database')
    } finally {
        await prisma.$disconnect()
    }
}

export async function seedRole() {
    try {
        await seedRoles$()
        console.log('Roles seeded successfully.')
    } catch (error) {
        console.error('Error seeding roles:', error)
    } finally {
        await prisma.$disconnect()
    }
}
