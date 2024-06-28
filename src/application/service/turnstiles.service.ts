import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../module/prisma.service';
import { TurnstileCreateDto, TurnstileUpdateDto } from '../dto/turnstiles.dto';

@Injectable()
export class TurnstilesService {
  constructor(private prisma: PrismaService) {}
  private logger: Logger = new Logger();

  async create(data: TurnstileCreateDto, placeId: number) {
    this.logger.log(`Creating turnstile with data: ${JSON.stringify(data)}`);

    const turnstile = await this.prisma.turnstile.create({
      data: {
        name: data.name,
        placeId: placeId,
      },
    });

    return turnstile;
  }

  async update(data: TurnstileUpdateDto) {
    this.logger.log(`Updating turnstile with data: ${JSON.stringify(data)}`);

    const turnstile = await this.prisma.turnstile.findFirstOrThrow({
      where: {
        id: Number(data.id),
      },
    });

    if (!turnstile) {
      throw new Error('Turnstile not found');
    }

    const updatedTurnstile = await this.prisma.turnstile.update({
      where: {
        id: Number(turnstile.id),
      },
      data: {
        name: data.name ?? turnstile.name,
        placeId: data.placeId ?? turnstile.placeId,
      },
    });

    return updatedTurnstile;
  }

  async find(id: number) {
    this.logger.log(`Find turnstile with ID ${id}`);

    try {
      const turnstile = await this.prisma.turnstile.findFirstOrThrow({
        where: {
          id: Number(id),
        },
      });

      return turnstile;
    } catch (error) {
      throw new BadGatewayException('Turnstile not found');
    }
  }

  async list() {
    this.logger.log(`Listing all turnstiles`);

    return await this.prisma.turnstile.findMany();
  }

  async delete(id: number) {
    this.logger.log(`Deleting turnstile with ID ${id}`);

    return await this.prisma.turnstile.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async deleteByPlaceId(placeId: number) {
    this.logger.log(`Deleting turnstiles with placeId ${placeId}`);

    await this.prisma.turnstile.deleteMany({
      where: {
        placeId: Number(placeId),
      },
    });
  }

  async createMany(data: TurnstileCreateDto[], placeId: number) {
    this.logger.log(`Creating multiple turnstiles for placeId ${placeId}`);

    const turnstiles = await this.prisma.turnstile.createMany({
      data: data.map((turnstile) => ({
        name: turnstile.name,
        placeId: placeId,
      })),
    });

    return turnstiles;
  }

  async updateMany(turnstiles: TurnstileUpdateDto[], placeId: number) {
    this.logger.log(`Updating multiple turnstiles for placeId ${placeId}`);

    const existingTurnstiles = await this.prisma.turnstile.findMany({
      where: { placeId: Number(placeId) },
    });

    const existingTurnstileIds = existingTurnstiles.map(
      (turnstile) => turnstile.id,
    );

    const turnstilesToDelete = existingTurnstileIds.filter(
      (id) => !turnstiles.some((turnstile) => turnstile.id === id),
    );

    if (turnstilesToDelete.length > 0) {
      await this.prisma.turnstile.deleteMany({
        where: { id: { in: turnstilesToDelete } },
      });
    }

    await Promise.all(
      turnstiles.map(async (turnstile) => {
        if (turnstile.id) {
          await this.prisma.turnstile.update({
            where: { id: turnstile.id },
            data: {
              name: turnstile.name,
              placeId: placeId,
            },
          });
        } else {
          await this.prisma.turnstile.create({
            data: {
              name: turnstile.name,
              placeId: placeId,
            },
          });
        }
      }),
    );
  }
}
