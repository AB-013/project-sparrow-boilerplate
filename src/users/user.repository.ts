import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  getInactiveUsers(): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.isActive = :active', { active: false })
      .getMany();
  }

  async searchUsersByFirstName(firstName: string): Promise<User[]> {
    const query = `
      SELECT * 
      FROM user 
      WHERE first_name = :firstName
    `;

    const results = await this.query(query, [firstName]);
    return results;
  }

  async createUserAndOtherActions(userData: Partial<User>): Promise<User> {
    // create a new query runner
    const queryRunner = this.dataSource.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();

    try {
      // Start the transaction
      await queryRunner.startTransaction();

      // Create a new user entity
      const newUser = this.create(userData);

      // Save the user entity within the transaction
      const savedUser = await queryRunner.manager.save(newUser);

      // we can execute any queries on a query runner, for example:
      await queryRunner.query('SELECT * FROM users');

      // Perform other actions within the transaction

      // Commit the transaction
      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      // If an error occurs, rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error; // You may want to handle the error or log it as needed
    } finally {
      // Release the queryRunner (important!)
      await queryRunner.release();
    }
  }
}
