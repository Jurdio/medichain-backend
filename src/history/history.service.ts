import { Injectable } from '@nestjs/common';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { TenantRepositoryFactory } from '../common/tenant/tenant-repository.factory';

@Injectable()
export class HistoryService {
  private historyRepository: Repository<History> & { qb(alias?: string): any };

  constructor(
    private readonly tenantRepoFactory: TenantRepositoryFactory,
  ) {
    this.historyRepository = this.tenantRepoFactory.getRepository(History);
  }

  create(createHistoryDto: CreateHistoryDto) {
    const historyEntry = this.historyRepository.create(createHistoryDto);
    return this.historyRepository.save(historyEntry);
  }

  async findAllByDoctor(
    doctorWalletAddress: string,
    page: number,
    limit: number,
    fromDate?: Date,
    toDate?: Date,
  ) {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<History> = { doctorWalletAddress };

    if (fromDate || toDate) {
      const from = fromDate ?? new Date(0);
      const to = toDate ?? new Date();
      where.createdAt = Between(from, to);
    }

    const [items, total] = await this.historyRepository.findAndCount({
      where,
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
