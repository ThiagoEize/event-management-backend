import {
  Injectable,
  Logger,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../module/prisma.service';
import {
  PlacesCreateDto,
  PlacesQueryDto,
  PlacesUpdateDto,
} from '../dto/places.dto';
import { GatesService } from './gates.service';
import { TurnstilesService } from './turnstiles.service';

@Injectable()
export class PlacesService {
  constructor(
    private prisma: PrismaService,
    private gatesService: GatesService,
    private turnstilesService: TurnstilesService,
  ) {}
  private logger: Logger = new Logger();

  async create(data: PlacesCreateDto) {
    this.logger.log(`Creating place with data: ${JSON.stringify(data)}`);

    const existingPlace = await this.prisma.place.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingPlace) {
      throw new HttpException(
        'Já existe um lugar com esse nome.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const place = await this.prisma.place.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
      },
    });

    if (data.gates) {
      await this.gatesService.createMany(data.gates, place.id);
    }

    if (data.turnstiles) {
      await this.turnstilesService.createMany(data.turnstiles, place.id);
    }

    return this.find(place.id);
  }

  async update(data: PlacesUpdateDto) {
    this.logger.log(`Updating place with data: ${JSON.stringify(data)}`);

    const place = await this.prisma.place.findFirstOrThrow({
      where: {
        id: Number(data.id),
      },
      include: {
        gates: true,
        turnstiles: true,
      },
    });

    if (!place) {
      throw new BadRequestException('Place not found');
    }

    const existingPlace = await this.prisma.place.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingPlace && existingPlace.id !== place.id) {
      throw new HttpException(
        'Já existe um lugar com esse nome.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.gates) {
      await this.gatesService.updateMany(data.gates, place.id);
    }

    if (data.turnstiles) {
      await this.turnstilesService.updateMany(data.turnstiles, place.id);
    }

    const updatedPlace = await this.prisma.place.update({
      where: {
        id: Number(place.id),
      },
      data: {
        name: data.name ?? place.name,
        address: data.address ?? place.address,
        city: data.city ?? place.city,
        state: data.state ?? place.state,
      },
      include: {
        gates: true,
        turnstiles: true,
      },
    });

    return updatedPlace;
  }

  async find(id: number) {
    this.logger.log(`Find place with ID ${id}`);

    try {
      const place = await this.prisma.place.findFirstOrThrow({
        include: {
          gates: true,
          turnstiles: true,
        },
        where: {
          id: Number(id),
        },
      });

      return place;
    } catch (error) {
      throw new BadRequestException('Place not found');
    }
  }

  async list(query: PlacesQueryDto) {
    this.logger.log(`Listing places with filters ${JSON.stringify(query)}`);

    const page = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10000000;
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
      orderBy = { name: 'asc' };
    }

    const places = await this.prisma.place.findMany({
      where,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
      skip: skip,
      take: limit,
      include: {
        gates: true,
        turnstiles: true,
      },
    });

    const totalPlaces = await this.prisma.place.count({ where });

    return {
      data: places,
      total: totalPlaces,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalPlaces / limit),
    };
  }

  async delete(id: number) {
    this.logger.log(`Deleting place with ID ${id}`);

    const events = await this.prisma.event.findMany({
      where: {
        placeId: Number(id),
      },
    });

    if (events.length > 0) {
      console.log('events', events);
      throw new HttpException(
        'Existe um evento nesse lugar não é possível deletar.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.gatesService.deleteByPlaceId(id);
    await this.turnstilesService.deleteByPlaceId(id);

    return await this.prisma.place.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
