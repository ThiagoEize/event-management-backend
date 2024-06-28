import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TurnstileCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  placeId: number;
}

export class TurnstileUpdateDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  placeId?: number;
}
