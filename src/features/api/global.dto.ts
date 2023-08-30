import { IsOptional, IsInt, IsPositive, IsString } from 'class-validator'

export class FindAllQuery {
    @IsOptional()
    @IsString()
    filter?: string

    @IsOptional()
    @IsInt()
    @IsPositive()
    page?: number

    @IsOptional()
    @IsInt()
    @IsPositive()
    limit?: number

    @IsOptional()
    @IsString()
    sortBy?: string

    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
    data: T
    _meta?: ApiResponseMeta
}

export interface ApiResponseMeta {
    totalCount?: number
    pageCount?: number
    currentPage?: number
}
