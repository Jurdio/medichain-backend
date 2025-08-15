import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { ProtectService } from './protect.service';

@Controller('protect')
export class ProtectController {
  constructor(private readonly protectService: ProtectService) {}

  @Post('/issue')
  @UseInterceptors(FileInterceptor('attachments'))
  async issueCertificate(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCertificateDto: CreateCertificateDto,
  ) {
    return this.protectService.issueCertificate(createCertificateDto, file);
  }
}
