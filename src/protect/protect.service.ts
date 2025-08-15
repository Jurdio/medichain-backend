import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';

@Injectable()
export class ProtectService {
  async issueCertificate(
    createCertificateDto: CreateCertificateDto,
    file: Express.Multer.File,
  ) {
    console.log('Received DTO:', createCertificateDto);
    console.log('Received file:', file);
    // Implement your logic here: save to DB, upload to IPFS, interact with Solana, etc.
    return { message: 'Certificate issuance initiated', data: createCertificateDto, file: file.originalname };
  }
}
