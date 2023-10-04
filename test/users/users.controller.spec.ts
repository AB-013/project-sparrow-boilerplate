import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import omit from 'lodash.omit';

import { UserController } from '@src/users/user.controller';
import { User } from '@src/users/user.entity';
import { UserService } from '@src/users/user.service';

import { createMockUser, createUserDto, updateUserDto } from './users.mock';

// Create a mock UserService
const mockUserService = {
  index: jest.fn(),
  getInactiveUsers: jest.fn(),
  findById: jest.fn(),
  store: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('index', () => {
    it('should return an array of users', async () => {
      const users: User[] = [createMockUser()];
      mockUserService.index.mockResolvedValue(users);

      const result = await userController.index();

      expect(result).toEqual(users);
    });
  });

  describe('getInactiveUser', () => {
    it('should return an array of inactive users', async () => {
      const inactiveUsers: User[] = [createMockUser(), createMockUser()];
      mockUserService.getInactiveUsers.mockResolvedValue(inactiveUsers);

      const result = await userController.getInactiveUser();

      expect(result).toEqual(inactiveUsers);
    });
  });

  describe('show', () => {
    it('should return a user when user exists', async () => {
      const userId = 1;
      const user: User = createMockUser();
      mockUserService.findById.mockResolvedValue(user);

      const result = await userController.show(userId);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = 999; // Assuming this user ID does not exist
      mockUserService.findById.mockResolvedValue(null);

      expect(userController.show(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a user and return it', async () => {
      const createdUser: User = createMockUser(createUserDto);
      mockUserService.store.mockResolvedValue(createdUser);

      const result = await userController.create(createUserDto);
      console.error(result);
      console.warn(createdUser);
      expect(result).toEqual(omit(createdUser, ['password']));
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const userId = 1;
      const updatedUser: User = createMockUser(updateUserDto);
      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await userController.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
    });
  });

  describe('destroy', () => {
    it('should delete a user and return the delete result', async () => {
      const userId = 1;
      const deleteResult = { raw: [], affected: 1, generatedMaps: [] }; // Mocked delete result
      mockUserService.delete.mockResolvedValue(deleteResult);

      const result = await userController.destroy(userId);

      expect(result).toEqual(deleteResult);
    });
  });
});
