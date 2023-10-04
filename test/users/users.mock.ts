import { faker } from '@faker-js/faker';

import { CreateUserDto } from '@src/users/dto/create-user.dto';
import { UpdateUserDto } from '@src/users/dto/update-user.dto';
import { User } from '@src/users/user.entity';

export const createMockUser = (options?: Partial<User>): User => {
  return new User({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...options,
  });
};

const password = faker.internet.password();
export const createUserDto: CreateUserDto = {
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password,
  password_confirmation: password,
  isActive: true,
};

export const updateUserDto: UpdateUserDto = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.internet.password(),
  password_confirmation: faker.internet.password(),
  isActive: true,
};
