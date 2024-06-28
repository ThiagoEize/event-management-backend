import { Test, TestingModule } from '@nestjs/testing';
import { GatesController } from './gates.controller';
import { GatesService } from '../application/service/gates.service';
import { GateCreateDto, GateUpdateDto } from '../application/dto/gates.dto';

describe('GatesController', () => {
  let controller: GatesController;
  let gatesService: GatesService;

  const mockGatesService = {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    list: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatesController],
      providers: [{ provide: GatesService, useValue: mockGatesService }],
    }).compile();

    controller = module.get<GatesController>(GatesController);
    gatesService = module.get<GatesService>(GatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return a gate', async () => {
      const result = {
        id: 1,
        name: 'Sample Gate',
        placeId: 1,
      };
      jest.spyOn(gatesService, 'find').mockResolvedValue(result);

      expect(await controller.find(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new gate', async () => {
      const data: GateCreateDto = {
        name: 'Sample Gate',
        placeId: 1,
      };
      const result = {
        id: 1,
        ...data,
      };
      jest.spyOn(gatesService, 'create').mockResolvedValue(result);

      expect(await controller.create(data)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a gate', async () => {
      const data: GateUpdateDto = { id: 1, name: 'Updated Gate' };
      const result = {
        id: 1,
        name: 'Updated Gate',
        placeId: 1,
      };
      jest.spyOn(gatesService, 'update').mockResolvedValue(result);

      expect(await controller.update(1, data)).toBe(result);
    });
  });

  describe('list', () => {
    it('should return a list of gates', async () => {
      const result = [
        {
          id: 1,
          name: 'Sample Gate',
          placeId: 1,
        },
      ];
      jest.spyOn(gatesService, 'list').mockResolvedValue(result);

      expect(await controller.list()).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a gate', async () => {
      const result = { id: 1, name: 'test', placeId: 1 };
      jest.spyOn(gatesService, 'delete').mockResolvedValue(result);

      expect(await controller.delete(1)).toBe(result);
    });
  });
});
