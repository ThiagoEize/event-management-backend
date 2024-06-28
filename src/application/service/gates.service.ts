import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../module/prisma.service';
import { GateCreateDto, GateUpdateDto } from '../dto/gates.dto';

@Injectable()
export class GatesService {
  constructor(private prisma: PrismaService) {}
  private logger: Logger = new Logger();

  async create(data: GateCreateDto, placeId: number) {
    this.logger.log(`Creating gate with data: ${JSON.stringify(data)}`);

    const gate = await this.prisma.gate.create({
      data: {
        name: data.name,
        placeId: placeId,
      },
    });

    return gate;
  }

  async update(data: GateUpdateDto) {
    this.logger.log(`Updating gate with data: ${JSON.stringify(data)}`);

    const gate = await this.prisma.gate.findFirstOrThrow({
      where: {
        id: Number(data.id),
      },
    });

    if (!gate) {
      throw new Error('Gate not found');
    }

    const updatedGate = await this.prisma.gate.update({
      where: {
        id: Number(gate.id),
      },
      data: {
        name: data.name ?? gate.name,
        placeId: data.placeId ?? gate.placeId,
      },
    });

    return updatedGate;
  }

  async find(id: number) {
    this.logger.log(`Find gate with ID ${id}`);

    try {
      const gate = await this.prisma.gate.findFirstOrThrow({
        where: {
          id: Number(id),
        },
      });

      return gate;
    } catch (error) {
      throw new BadRequestException('Gate not found');
    }
  }

  async list() {
    this.logger.log(`Listing all gates`);

    return await this.prisma.gate.findMany();
  }

  async delete(id: number) {
    this.logger.log(`Deleting gate with ID ${id}`);

    return await this.prisma.gate.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async deleteByPlaceId(placeId: number) {
    this.logger.log(`Deleting gates with placeId ${placeId}`);

    await this.prisma.gate.deleteMany({
      where: {
        placeId: Number(placeId),
      },
    });
  }

  async createMany(data: GateCreateDto[], placeId: number) {
    this.logger.log(`Creating multiple gates for placeId ${placeId}`);

    const gates = await this.prisma.gate.createMany({
      data: data.map((gate) => ({
        name: gate.name,
        placeId: placeId,
      })),
    });

    return gates;
  }

  async updateMany(gates: GateUpdateDto[], placeId: number) {
    this.logger.log(`Updating multiple gates for placeId ${placeId}`);

    const existingGates = await this.prisma.gate.findMany({
      where: { placeId: Number(placeId) },
    });

    const existingGateIds = existingGates.map((gate) => gate.id);

    const gatesToDelete = existingGateIds.filter(
      (id) => !gates.some((gate) => gate.id === id),
    );

    if (gatesToDelete.length > 0) {
      await this.prisma.gate.deleteMany({
        where: { id: { in: gatesToDelete } },
      });
    }

    await Promise.all(
      gates.map(async (gate) => {
        if (gate.id) {
          await this.prisma.gate.update({
            where: { id: gate.id },
            data: {
              name: gate.name,
              placeId: placeId,
            },
          });
        } else {
          await this.prisma.gate.create({
            data: {
              name: gate.name,
              placeId: placeId,
            },
          });
        }
      }),
    );
  }
}
