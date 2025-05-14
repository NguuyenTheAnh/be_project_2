import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ResponseMessage } from '@/decorator/customize';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  @ResponseMessage('Create account')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ResponseMessage('Get all accounts')
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Get account by ID')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Update account')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete account')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
