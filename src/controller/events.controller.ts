import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { isAfter, isBefore, isValid, parseISO } from 'date-fns';
import {
  EventsCreateDto,
  EventsQueryDto,
  EventsUpdateDto,
} from '../application/dto/events.dto';
import { EventsService } from '../application/service/events.service';
import { PlacesService } from '../application/service/places.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly placesService: PlacesService,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Find event by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Event ID' })
  async find(@Param('id') id: number) {
    return this.eventsService.find(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new event' })
  async create(@Body() data: EventsCreateDto) {
    console.log('data', data);
    const dateStart = parseISO(String(data.dateStart));
    const dateEnd = parseISO(String(data.dateEnd));

    if (!isValid(dateStart)) {
      throw new BadRequestException('Data de início inválida');
    }

    if (!isValid(dateEnd)) {
      throw new BadRequestException('Data de término inválida');
    }

    const now = new Date();

    if (isBefore(dateStart, now)) {
      throw new BadRequestException('Data do evento não pode ser no passado');
    }

    if (isAfter(dateStart, dateEnd)) {
      throw new BadRequestException(
        'Data de início deve ser anterior a data de término',
      );
    }

    await this.placesService.find(data.placeId);

    const placeEvents = await this.eventsService.listByPlaceId(data.placeId);

    const isEventOverlapping = this.eventsService.isEventOverlapping(
      placeEvents,
      data.dateStart as Date,
      data.dateEnd as Date,
    );

    if (isEventOverlapping) {
      throw new ConflictException('Já existe um evento nesse horário');
    }

    const eventNameExists = await this.eventsService.eventNameExists(
      data.event,
    );

    if (eventNameExists) {
      throw new ConflictException('Nome do evento deve ser único');
    }

    return this.eventsService.create(data);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', type: Number, description: 'Event ID' })
  async update(@Param('id') id: number, @Body() data: EventsUpdateDto) {
    const dateStart = parseISO(String(data.dateStart));
    const dateEnd = parseISO(String(data.dateEnd));
    const now = new Date();
    if (isBefore(dateStart, now)) {
      throw new BadRequestException('Data do evento não pode ser no passado');
    }

    if (isAfter(dateStart, dateEnd)) {
      throw new BadRequestException(
        'Data de início deve ser anterior a data de término',
      );
    }
    data.id = id;
    return this.eventsService.update(data);
  }

  @Get('/')
  @ApiOperation({ summary: 'List all events' })
  @ApiQuery({ name: 'placeId', required: false, type: Number })
  @ApiQuery({ name: 'event', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'dateStart', required: false, type: Date })
  @ApiQuery({ name: 'dateEnd', required: false, type: Date })
  @ApiQuery({ name: 'order', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async list(@Query() query: EventsQueryDto) {
    return this.eventsService.list(query);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', type: Number, description: 'Event ID' })
  async delete(@Param('id') id: number) {
    return this.eventsService.delete(id);
  }
}
