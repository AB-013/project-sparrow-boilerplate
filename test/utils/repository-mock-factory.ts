import { BaseEntity, Repository } from 'typeorm';

export const repositoryMockFactory: <E extends BaseEntity>() => MockType<
  Repository<E>
> = jest.fn(
  <E extends BaseEntity, I, U>() =>
    ({
      findOne: jest.fn((): E | undefined => undefined), //jest.fn((id: number): E => ({ id } as unknown as E)),
      create: jest.fn(
        (createinput: I): E =>
          ({
            ...createinput,
          }) as unknown as E,
      ),
      save: jest.fn((updateInput: U) => ({
        ...updateInput,
      })),
      delete: jest.fn((id: number) => id > 10),
      find: jest.fn(),
      findAndCount: jest.fn(),
    }) as MockType<Repository<E>>,
);

export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};
