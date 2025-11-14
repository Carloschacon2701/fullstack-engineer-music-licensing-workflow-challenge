import { Status } from '@/modules/licenses/entities/status.entity';
import { LicenseStatusEnum } from '@/modules/licenses/entities/license.status.enum';
import { BaseSeeder } from './base.seeder';

export class StatusSeeder extends BaseSeeder {
  async seed(): Promise<void> {
    const statusRepository = this.dataSource.getRepository(Status);

    const statuses = [
      { name: 'Pending', id: LicenseStatusEnum.PENDING },
      { name: 'In Negotiation', id: LicenseStatusEnum.IN_NEGOTIATION },
      { name: 'Cancelled', id: LicenseStatusEnum.CANCELLED },
      { name: 'Approved', id: LicenseStatusEnum.APPROVED },
      { name: 'Rejected', id: LicenseStatusEnum.REJECTED },
    ];

    await statusRepository.upsert(statuses, ['name']);
    console.log(`   Upserted ${statuses.length} statuses`);
  }
}
