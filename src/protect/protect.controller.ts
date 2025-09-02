import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { ProtectService } from './protect.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/permissions.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('protect')
export class ProtectController {
  constructor(private readonly protectService: ProtectService) {}

  @Post('/create-certificate')
  @RequirePermission('Documents', 'protect', 'save')
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
  async createCertificate(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCertificateDto: CreateCertificateDto,
  ) {
    return this.protectService.createCertificate(createCertificateDto, file);
  }
}
