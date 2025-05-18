import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionRepository.find({ relations: ['table'], order: { created_at: 'ASC' } });
  }

  async findOne(transaction_id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { transaction_id },
      relations: ['table'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transaction_id} not found`);
    }
    return transaction;
  }

  async update(transaction_id: string, updateTransactionDto: UpdateTransactionDto) {
    return await this.transactionRepository.update(
      { transaction_id: transaction_id },
      updateTransactionDto
    )
  }

  async remove(transaction_id: string) {
    const transaction = await this.findOne(transaction_id);
    return await this.transactionRepository.remove(transaction);
  }
}