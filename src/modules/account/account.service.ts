import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '@/helper/bcrypt.helper';

@Injectable()
export class AccountService {

  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) { }
  async create(data: CreateAccountDto) {
    const newAccount = this.accountRepository.create(data);
    return await this.accountRepository.save(newAccount);
  }

  async findAll() {
    return await this.accountRepository.find({
      where: { role: 'Employee' },
      select: {
        account_id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        is_active: true,
        created_at: true,
        updated_at: true
      },
      order: {
        created_at: 'DESC'
      }
    });
  }

  async findOne(id: number) {
    const account = await this.accountRepository.findOne({
      where: { account_id: id },
      select: {
        account_id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!account) {
      throw new Error(`Account with ID ${id} not found`);
    }

    return account;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    if (updateAccountDto?.password) {
      // Hash the password and save the user
      const hashedPassword = await hashPassword(updateAccountDto.password as string);
      updateAccountDto = {
        ...updateAccountDto, password: hashedPassword
      }
    }

    return await this.accountRepository.update(
      { account_id: id },
      {
        ...updateAccountDto
      }
    );
  }

  async remove(id: number) {
    // Soft delete the account
    return await this.accountRepository.softDelete({ account_id: id });

  }

  async findByEmail(email: string) {
    // Use the repository to find the account by email
    return await this.accountRepository.findOne({ where: { email } });
  }

  async updateUserToken(refreshToken: string, _id: number) {
    await this.accountRepository.update(
      { account_id: _id },
      { refresh_token: refreshToken },
    );
  }

  async findUserByToken(refreshToken: string) {
    return await this.accountRepository.findOne({
      where: { refresh_token: refreshToken },
    });
  }

  async removeUserToken(_id: number) {
    await this.accountRepository.update(
      { account_id: _id },
      { refresh_token: '' },
    );
  }

}
