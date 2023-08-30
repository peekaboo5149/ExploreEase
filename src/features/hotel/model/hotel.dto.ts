import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateHotelDto {
    @IsNotEmpty()
    @IsString()
    name: string
    @IsString()
    @IsOptional()
    desc?: string
}

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
