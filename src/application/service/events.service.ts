import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../module/prisma.service';
import {
  EventsCreateDto,
  EventsQueryDto,
  EventsUpdateDto,
} from '../dto/events.dto';
import { isWithinInterval } from 'date-fns';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
  private logger: Logger = new Logger();

  async create(data: EventsCreateDto) {
    this.logger.log(`Creating event with data: ${JSON.stringify(data)}`);

    return await this.prisma.event.create({
      data: {
        placeId: data.placeId,
        event: data.event,
        type: data.type,
        email: data.email,
        phone: data.phone,
        dateStart: new Date(data.dateStart).toISOString(),
        dateEnd: new Date(data.dateEnd).toISOString(),
      },
    });
  }

  async update(data: EventsUpdateDto) {
    this.logger.log(`Updating event with data: ${JSON.stringify(data)}`);

    const event = await this.prisma.event.findFirstOrThrow({
      where: {
        id: Number(data.id),
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return await this.prisma.event.update({
      where: {
        id: Number(event.id),
      },
      data: {
        placeId: data.placeId ?? event.placeId,
        event: data.event ?? event.event,
        type: data.type ?? event.type,
        email: data.email ?? event.email,
        phone: data.phone ?? event.phone,
        dateStart: data.dateStart
          ? new Date(data.dateStart).toISOString()
          : event.dateStart,
        dateEnd: data.dateEnd
          ? new Date(data.dateEnd).toISOString()
          : event.dateEnd,
      },
    });
  }

  async find(id: number) {
    this.logger.log(`Find event with ID ${id}`);

    try {
      const event = await this.prisma.event.findFirstOrThrow({
        where: {
          id: Number(id),
        },
        include: {
          place: true,
        },
      });

      return event;
    } catch (error) {
      throw new BadRequestException('Event not found');
    }
  }

  async eventNameExists(eventName: string) {
    this.logger.log(`Find event with name ${eventName}`);

    try {
      await this.prisma.event.findFirstOrThrow({
        where: {
          event: eventName,
        },
        include: {
          place: true,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  isEventOverlapping(
    events: EventsCreateDto[],
    dateStart: Date,
    dateEnd: Date,
  ): boolean {
    for (const event of events) {
      if (
        isWithinInterval(dateStart, {
          start: event.dateStart,
          end: event.dateEnd,
        }) ||
        isWithinInterval(dateEnd, {
          start: event.dateStart,
          end: event.dateEnd,
        }) ||
        isWithinInterval(event.dateStart, { start: dateStart, end: dateEnd }) ||
        isWithinInterval(event.dateEnd, { start: dateStart, end: dateEnd })
      ) {
        return true;
      }
    }
    return false;
  }

  async listByPlaceId(placeId: number) {
    this.logger.log(`Find events by place ID ${placeId}`);

    return this.prisma.event.findMany({
      where: { placeId },
    });
  }

  async list(query: EventsQueryDto) {
    this.logger.log(`Listing events with filters ${JSON.stringify(query)}`);

    const page = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      const [field, term] = query.search.split(':');
      if (field && term) {
        where[field] = {
          contains: term,
          mode: 'insensitive', // Prisma specific option for case-insensitive search
        };
      }
    }

    let orderBy: any = {};
    if (query.order) {
      const [field, direction] = query.order.split(' ');
      orderBy = { [field]: direction };
    } else {
      orderBy = { event: 'asc' };
    }

    const events = await this.prisma.event.findMany({
      where,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      skip: skip,
      take: limit,
    });

    const totalEvents = await this.prisma.event.count({ where });

    return {
      data: events,
      total: totalEvents,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalEvents / limit),
    };
  }

  async delete(id: number) {
    this.logger.log(`Deleting event with ID ${id}`);

    const event = await this.prisma.event.findFirstOrThrow({
      where: {
        id: Number(id),
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return await this.prisma.event.delete({
      where: {
        id: Number(event.id),
      },
    });
  }
}
