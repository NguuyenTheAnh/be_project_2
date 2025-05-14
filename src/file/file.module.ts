import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './file.controller';
import { MulterConfigService } from './multer.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    })
  ],
  controllers: [FilesController],
})
export class FileModule { }
