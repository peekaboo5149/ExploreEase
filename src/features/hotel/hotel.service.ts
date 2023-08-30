import { Injectable } from '@nestjs/common'
import { FindAllQuery } from '../api/global.dto'
import { CreateHotelDto, UpdateHotelDto } from './model/hotel.dto'
import { IHotel } from './model/iHotel'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class HotelService {
    constructor(private readonly prisma: PrismaService) {}

    getAllHotels(query: FindAllQuery): Array<IHotel> {
        const { filter, limit, page, sortBy, sortOrder } = query
        return [] as Array<IHotel>
    }

    getHotel(hotelId: string) {
        throw new Error('Method not implemented.')
    }

    addHotel(createHotelDto: CreateHotelDto) {
        throw new Error('Method not implemented.')
    }

    updateHotel(hotelId: string, updateHotelDto: UpdateHotelDto) {
        throw new Error('Method not implemented.')
    }

    deleteHotel(hotelId: string) {
        throw new Error('Method not implemented.')
    }
}
