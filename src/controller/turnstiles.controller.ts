import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  TurnstileCreateDto,
  TurnstileUpdateDto,
} from '../application/dto/turnstiles.dto';
import { TurnstilesService } from '../application/service/turnstiles.service';

@ApiTags('turnstiles')
@Controller('turnstiles')
export class TurnstilesController {
  constructor(private readonly turnstilesService: TurnstilesService) {}

  @Get('/:id')
  async find(@Param('id') id: number) {
    return this.turnstilesService.find(id);
  }

  @Post('/')
  async create(@Body() data: TurnstileCreateDto) {
    return this.turnstilesService.create(data, data.placeId);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() data: TurnstileUpdateDto) {
    data.id = id;
    return this.turnstilesService.update(data);
  }

  @Get('/')
  async list() {
    return this.turnstilesService.list();
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.turnstilesService.delete(id);
  }
}
