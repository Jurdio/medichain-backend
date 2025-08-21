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

  async findAllByDoctor(
    doctorWalletAddress: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.historyRepository.findAndCount({
      where: { doctorWalletAddress },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        perPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}
