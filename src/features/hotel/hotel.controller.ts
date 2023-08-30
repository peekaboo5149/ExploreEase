import { Public } from '@auth/auth.decorator'
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common'
import { ApiResponseMeta, FindAllQuery } from '../api/global.dto'
import { HotelService } from './hotel.service'
import { CreateHotelDto, UpdateHotelDto } from './model/hotel.dto'

@Controller('hotel')
export class HotelController {
    private readonly logger: Logger = new Logger(HotelController.name)
    constructor(private readonly hotelService: HotelService) {}

    @HttpCode(HttpStatus.OK)
    @Public()
    @Get()
    async getAllHotels(@Query() query: FindAllQuery) {
        const hotels = await this.hotelService.getAllHotels(query)
        const meta: ApiResponseMeta = {
            totalCount: hotels.length,
            pageCount: hotels.length,
            currentPage: query.page || 1,
        }
        return { data: hotels, _meta: meta }
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    addHotel(@Body() createHotelDto: CreateHotelDto) {
        return this.hotelService.addHotel(createHotelDto)
    }

    @HttpCode(HttpStatus.OK)
    @Public()
    @Get('/:hotelId')
    getHotel(@Param('hotelId') hotelId: string) {
        return this.hotelService.getHotel(hotelId)
    }

    @HttpCode(HttpStatus.OK)
    @Patch('/:hotelId')
    updateHotel(
        @Param('hotelId') hotelId: string,
        @Body() updateHotelDto: UpdateHotelDto,
    ) {
        return this.hotelService.updateHotel(hotelId, updateHotelDto)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:hotelId')
    deleteHotel(@Param('hotelId') hotelId: string) {
        return this.hotelService.deleteHotel(hotelId)
    }
}
