import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EventsCreateDto {
  @ApiProperty()
  placeId: number;

  @ApiProperty()
  event: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  dateStart: Date;

  @ApiProperty()
  dateEnd: Date;
}

export class EventsUpdateDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  placeId?: number;

  @ApiPropertyOptional()
  event?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  type?: string;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;

  @ApiPropertyOptional()
  dateStart?: Date;

  @ApiPropertyOptional()
  dateEnd?: Date;
}

export class EventsQueryDto {
  @ApiPropertyOptional()
  placeId?: number;

  @ApiPropertyOptional()
  event?: string;

  @ApiPropertyOptional()
  type?: string;

  @ApiPropertyOptional()
  dateStart?: Date;

  @ApiPropertyOptional()
  dateEnd?: Date;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;

  @ApiPropertyOptional()
  order?: string;

  @ApiPropertyOptional()
  search?: string;

  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;
}
