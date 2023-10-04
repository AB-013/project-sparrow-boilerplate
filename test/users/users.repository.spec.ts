import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { User } from '@src/users/user.entity';
import { UserRepository } from '@src/users/user.repository';

import { createMockUser, createUserDto } from './users.mock';

// Create mock DataSource and Repository
const mockDataSource = {
  createEntityManager: jest.fn(),
  createQueryBuilder: jest.fn(),
  query: jest.fn(),
  createQueryRunner: jest.fn(),
};

const mockUserRepository = {
  getInactiveUsers: jest.fn(),
  searchUsersByFirstName: jest.fn(),
  createUserAndOtherActions: jest.fn(),
};

describe.skip('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('getInactiveUsers', () => {
    it('should return an array of inactive users', async () => {
      const inactiveUsers: User[] = [
        createMockUser({ isActive: false }),
        createMockUser({ isActive: false }),
      ];
      mockUserRepository.getInactiveUsers.mockResolvedValue(inactiveUsers);

      const result = await userRepository.getInactiveUsers();

      expect(result).toEqual(inactiveUsers);
    });
  });

  describe('searchUsersByFirstName', () => {
    it('should return an array of users with the specified first name', async () => {
      const firstName = 'John';
      const usersWithFirstName: User[] = [
        createMockUser({ firstName: 'John' }),
      ];
      mockUserRepository.searchUsersByFirstName.mockResolvedValue(
        usersWithFirstName,
      );

      const result = await userRepository.searchUsersByFirstName(firstName);

      expect(result).toEqual(usersWithFirstName);
    });
  });

  describe('createUserAndOtherActions', () => {
    it('should create a user and return it', async () => {
      const userData: Partial<User> = createUserDto;
      const createdUser: User = createMockUser(userData);
      mockUserRepository.createUserAndOtherActions.mockResolvedValue(
        createdUser,
      );

      const result = await userRepository.createUserAndOtherActions(userData);

      expect(result).toEqual(createdUser);
    });
  });
});
