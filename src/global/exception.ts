import { UnauthorizedException } from '@nestjs/common'

export class AdminPrivilegeException extends UnauthorizedException {
    constructor(moreInformation?: string) {
        super(
            'You need to be a admin to access this resource' +
                (moreInformation ?? ''),
        )
    }
}

export class UnderPrivilegeException extends UnauthorizedException {
    constructor(private readonly role: string, moreInformation?: string) {
        super(
            `You need to be a ${role} to access this resource. ` +
                (moreInformation ?? ''),
        )
    }
}
