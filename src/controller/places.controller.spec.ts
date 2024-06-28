import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from './places.controller';
import { PlacesService } from '../application/service/places.service';
import {
  PlacesCreateDto,
  PlacesUpdateDto,
  PlacesQueryDto,
} from '../application/dto/places.dto';
import { GateCreateDto } from '../application/dto/gates.dto';
import { TurnstileCreateDto } from '../application/dto/turnstiles.dto';

describe('PlacesController', () => {
  let controller: PlacesController;
  let placesService: PlacesService;

  const mockPlacesService = {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    list: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [{ provide: PlacesService, useValue: mockPlacesService }],
    }).compile();

    controller = module.get<PlacesController>(PlacesController);
    placesService = module.get<PlacesService>(PlacesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return a place', async () => {
      const result = {
        id: 1,
        name: 'Sample Place',
        address: '123 Main St',
        city: 'Sample City',
        state: 'Sample State',
        createdAt: new Date(),
        updatedAt: new Date(),
        gates: [{ id: 1, name: 'Gate 1', placeId: 1 }],
        turnstiles: [{ id: 1, name: 'Turnstile 1', placeId: 1 }],
      };
      jest.spyOn(placesService, 'find').mockResolvedValue(result);

      expect(await controller.find(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new place', async () => {
      const data: PlacesCreateDto = {
        name: 'Sample Place',
        address: '123 Main St',
        city: 'Sample City',
        state: 'Sample State',
        gates: [{ name: 'Gate 1', placeId: 1 } as GateCreateDto],
        turnstiles: [{ name: 'Turnstile 1', placeId: 1 } as TurnstileCreateDto],
      };
      const result = {
        id: 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        gates: [{ id: 1, name: 'Gate 1', placeId: 1 }],
        turnstiles: [{ id: 1, name: 'Turnstile 1', placeId: 1 }],
      };
      jest.spyOn(placesService, 'create').mockResolvedValue(result);

      expect(await controller.create(data)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      const data: PlacesUpdateDto = { id: 1, name: 'Updated Place' };
      const result = {
        id: 1,
        name: 'Updated Place',
        address: '123 Main St',
        city: 'Sample City',
        state: 'Sample State',
        createdAt: new Date(),
        updatedAt: new Date(),
        gates: [
          { id: 1, name: 'Gate 1', placeId: 1 } as {
            id: number;
            name: string;
            placeId: number;
          },
        ],
        turnstiles: [
          { id: 1, name: 'Turnstile 1', placeId: 1 } as {
            id: number;
            name: string;
            placeId: number;
          },
        ],
      };
      jest.spyOn(placesService, 'update').mockResolvedValue(result);

      expect(await controller.update(1, data)).toBe(result);
    });
  });

  describe('list', () => {
    it('should return a list of places', async () => {
      const query: PlacesQueryDto = {};
      const result = {
        data: [
          {
            id: 1,
            name: 'Sample Place',
            address: '123 Main St',
            city: 'Sample City',
            state: 'Sample State',
            createdAt: new Date(),
            updatedAt: new Date(),
            gates: [{ id: 1, name: 'Gate 1', placeId: 1 }],
            turnstiles: [{ id: 1, name: 'Turnstile 1', placeId: 1 }],
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      jest.spyOn(placesService, 'list').mockResolvedValue(result);

      expect(await controller.list(query)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a place', async () => {
      const result = {
        id: 1,
        name: 'Sample Place',
        address: '123 Main St',
        city: 'Sample City',
        state: 'Sample State',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(placesService, 'delete').mockResolvedValue(result);

      expect(await controller.delete(1)).toBe(result);
    });
  });
});
