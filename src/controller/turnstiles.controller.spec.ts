import { Test, TestingModule } from '@nestjs/testing';
import { TurnstilesController } from './turnstiles.controller';
import { TurnstilesService } from '../application/service/turnstiles.service';
import {
  TurnstileCreateDto,
  TurnstileUpdateDto,
} from '../application/dto/turnstiles.dto';

describe('TurnstilesController', () => {
  let controller: TurnstilesController;
  let turnstilesService: TurnstilesService;

  const mockTurnstilesService = {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    list: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnstilesController],
      providers: [
        { provide: TurnstilesService, useValue: mockTurnstilesService },
      ],
    }).compile();

    controller = module.get<TurnstilesController>(TurnstilesController);
    turnstilesService = module.get<TurnstilesService>(TurnstilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return a turnstile', async () => {
      const result = {
        id: 1,
        name: 'Sample Turnstile',
        placeId: 1,
      };
      jest.spyOn(turnstilesService, 'find').mockResolvedValue(result);

      expect(await controller.find(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new turnstile', async () => {
      const data: TurnstileCreateDto = {
        name: 'Sample Turnstile',
        placeId: 1,
      };
      const result = {
        id: 1,
        ...data,
      };
      jest.spyOn(turnstilesService, 'create').mockResolvedValue(result);

      expect(await controller.create(data)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a turnstile', async () => {
      const data: TurnstileUpdateDto = { id: 1, name: 'Updated Turnstile' };
      const result = {
        id: 1,
        name: 'Updated Turnstile',
        placeId: 1,
      };
      jest.spyOn(turnstilesService, 'update').mockResolvedValue(result);

      expect(await controller.update(1, data)).toBe(result);
    });
  });

  describe('list', () => {
    it('should return a list of turnstiles', async () => {
      const result = [
        {
          id: 1,
          name: 'Sample Turnstile',
          placeId: 1,
        },
      ];
      jest.spyOn(turnstilesService, 'list').mockResolvedValue(result);

      expect(await controller.list()).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a turnstile', async () => {
      const result = {
        id: 1,
        name: 'Sample Turnstile',
        placeId: 1,
      };
      jest.spyOn(turnstilesService, 'delete').mockResolvedValue(result);

      expect(await controller.delete(1)).toBe(result);
    });
  });
});
