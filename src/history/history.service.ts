import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  create(createHistoryDto: CreateHistoryDto) {
    const historyEntry = this.historyRepository.create(createHistoryDto);
    return this.historyRepository.save(historyEntry);
  }

  findAllByDoctor(doctorWalletAddress: string) {
    return this.historyRepository.find({
      where: { doctorWalletAddress },
      order: { createdAt: 'DESC' },
    });
  }
}
