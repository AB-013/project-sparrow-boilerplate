import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@src/logger/logger.service';
import { UserRepository } from '@src/users/user.repository';
import { UserService } from '@src/users/user.service';

// Create mock objects and functions
const mockUserRepository = {
  findOne: jest.fn(),
  getInactiveUsers: jest.fn(),
};

const mockLoggerService = {
  error: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user when email exists', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findByEmail(email);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null when email does not exist', async () => {
      const email = 'nonexistent@example.com';
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findByEmail(email);

      expect(result).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('getInactiveUsers', () => {
    it('should return a list of inactive users', async () => {
      const inactiveUsers = [
        { id: 1, isActive: false },
        { id: 2, isActive: false },
      ];
      mockUserRepository.getInactiveUsers.mockResolvedValue(inactiveUsers);

      const result = await userService.getInactiveUsers();

      expect(result).toEqual(inactiveUsers);
      expect(mockUserRepository.getInactiveUsers).toHaveBeenCalled();
    });
  });
});
