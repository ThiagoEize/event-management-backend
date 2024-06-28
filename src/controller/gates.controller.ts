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
import { GateCreateDto, GateUpdateDto } from '../application/dto/gates.dto';
import { GatesService } from '../application/service/gates.service';

@ApiTags('gates')
@Controller('gates')
export class GatesController {
  constructor(private readonly gatesService: GatesService) {}

  @Get('/:id')
  async find(@Param('id') id: number) {
    return this.gatesService.find(id);
  }

  @Post('/')
  async create(@Body() data: GateCreateDto) {
    return this.gatesService.create(data, data.placeId);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() data: GateUpdateDto) {
    data.id = id;
    return this.gatesService.update(data);
  }

  @Get('/')
  async list() {
    return this.gatesService.list();
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.gatesService.delete(id);
  }
}
