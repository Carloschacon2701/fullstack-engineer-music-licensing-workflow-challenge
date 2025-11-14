import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { I18nException } from '@/common/exceptions/i18n.exception';
import { Track } from '../tracks/entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { License } from './entities/license.entity';
import { LicenseStatusEnum } from './entities/license.status.enum';
import { LicenseStatusHistory } from './entities/license-status-history.entity';

@Injectable()
export class LicensesService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
    @InjectRepository(LicenseStatusHistory)
    private licenseStatusHistoryRepository: Repository<LicenseStatusHistory>,
  ) {}

  private async updateLicenseStatus(license: License, statusId: number) {
    this.licenseRepository.update(license.id, {
      status_id: statusId,
    });
    const licenseStatusHistory = this.licenseStatusHistoryRepository.create({
      license_id: license.id,
      status_id: statusId,
    });

    await this.licenseStatusHistoryRepository.save(licenseStatusHistory);
  }

  private async statusMachine(
    statusId: LicenseStatusEnum,
    license: License,
  ): Promise<void> {
    const currentStatus = license.status_id;
    if (statusId === LicenseStatusEnum.PENDING) {
      if (currentStatus) {
        throw new I18nException(
          'license.status.alreadyGenerated',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.updateLicenseStatus(license, LicenseStatusEnum.PENDING);
    }

    if (statusId === LicenseStatusEnum.APPROVED) {
      const allowedStatuses = [LicenseStatusEnum.IN_NEGOTIATION];

      if (!allowedStatuses.includes(currentStatus)) {
        throw new I18nException(
          'license.status.notAllowed',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.updateLicenseStatus(license, LicenseStatusEnum.APPROVED);
    }

    if (statusId === LicenseStatusEnum.CANCELLED) {
      const allowedStatuses = [LicenseStatusEnum.PENDING];

      if (!allowedStatuses.includes(currentStatus)) {
        throw new I18nException(
          'license.status.notAllowed',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.updateLicenseStatus(license, LicenseStatusEnum.CANCELLED);
    }

    if (statusId === LicenseStatusEnum.REJECTED) {
      const allowedStatuses = [LicenseStatusEnum.IN_NEGOTIATION];

      if (!allowedStatuses.includes(currentStatus)) {
        throw new I18nException(
          'license.status.notAllowed',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.updateLicenseStatus(license, LicenseStatusEnum.REJECTED);
    }

    if (statusId === LicenseStatusEnum.IN_NEGOTIATION) {
      const allowedStatuses = [LicenseStatusEnum.PENDING];

      if (!allowedStatuses.includes(currentStatus)) {
        throw new I18nException(
          'license.status.notAllowed',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.updateLicenseStatus(license, LicenseStatusEnum.IN_NEGOTIATION);
    }
  }

  async create(createLicenseDto: CreateLicenseDto) {
    const { track_id } = createLicenseDto;

    const track = await this.trackRepository.findOneBy({ id: track_id });

    if (!track) {
      throw new I18nException('track.notFound', HttpStatus.NOT_FOUND);
    }

    const license = this.licenseRepository.create({
      track_id: track.id,
    });

    const savedLicense = await this.licenseRepository.save(license);

    await this.statusMachine(LicenseStatusEnum.PENDING, savedLicense);

    return savedLicense;
  }

  findOne(id: number) {
    return `This action returns a #${id} license`;
  }

  async update(id: number, updateLicenseDto: UpdateLicenseDto) {
    return `This action updates a #${id} license`;
  }

  remove(id: number) {
    return `This action removes a #${id} license`;
  }
}
