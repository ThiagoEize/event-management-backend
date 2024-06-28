import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GateCreateDto, GateUpdateDto } from './gates.dto';
import { TurnstileCreateDto, TurnstileUpdateDto } from './turnstiles.dto';

export class PlacesCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiPropertyOptional({ type: [GateCreateDto] })
  gates?: GateCreateDto[];

  @ApiPropertyOptional({ type: [TurnstileCreateDto] })
  turnstiles?: TurnstileCreateDto[];
}

export class PlacesUpdateDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional({ type: [GateUpdateDto] })
  gates?: GateUpdateDto[];

  @ApiPropertyOptional({ type: [TurnstileUpdateDto] })
  turnstiles?: TurnstileUpdateDto[];
}

export class PlacesQueryDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  order?: string;

  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  search?: string; // Add this line to include the search property
}
