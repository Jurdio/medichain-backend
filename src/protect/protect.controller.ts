import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { ProtectService } from './protect.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('protect')
export class ProtectController {
  constructor(private readonly protectService: ProtectService) {}

  @Post('/issue')
  @UseInterceptors(
    FileInterceptor('attachments', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async issueCertificate(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCertificateDto: CreateCertificateDto,
  ) {
    return this.protectService.issueCertificate(createCertificateDto, file);
  }
}
