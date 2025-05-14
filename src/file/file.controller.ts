import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, UseFilters
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize'

@Controller('file')
export class FilesController {

  @Public()
  @Post('upload')
  @ResponseMessage("Upload Single File")
  @UseInterceptors(FileInterceptor('imageUpload'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    }
  }
}