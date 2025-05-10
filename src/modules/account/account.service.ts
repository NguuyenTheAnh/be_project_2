import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
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
