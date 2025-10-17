import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  /**
   * 💡 [FINAL FIX]
   * Finds a user by email and explicitly includes the password field,
   * which is normally excluded due to the `select: false` option in the entity.
   * This is necessary for password validation during login.
   * @param email The email of the user to find
   * @returns The user entity with the password, or null if not found
   */
  async findOneByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    // Use the Query Builder to manually add the password to the selection.
    return this.usersRepository
      .createQueryBuilder('user') // Start building a query, 'user' is an alias for the User entity
      .where('user.email = :email', { email }) // Find the user by email
      .addSelect('user.password') // 💡 This is the crucial part: explicitly include the password
      .getOne(); // Execute the query and get a single result
  }

  async findOneById(id: number): Promise<User | null> {
    // This method will NOT return the password, which is correct for general-purpose lookups.
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID #${id} not found.`);
    }
  }
}

