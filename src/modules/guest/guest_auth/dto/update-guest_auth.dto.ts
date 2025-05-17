import { PartialType } from '@nestjs/mapped-types';
import { CreateGuestAuthDto } from './create-guest_auth.dto';

export class UpdateGuestAuthDto extends PartialType(CreateGuestAuthDto) {}
