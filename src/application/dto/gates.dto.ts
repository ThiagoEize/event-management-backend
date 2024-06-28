import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GateCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  placeId: number;
}

export class GateUpdateDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  placeId?: number;
}
