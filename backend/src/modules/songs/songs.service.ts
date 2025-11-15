import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { FindAllSongDto } from './dto/findAll-song.dto';
import { calculatePagination } from '@/utils/getSkipPage';
import { calculatePaginationResponse } from '@/utils/calculatePaginationResponse';
import { I18nException } from '@/common/exceptions/i18n.exception';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private readonly i18n: I18nService,
  ) {}

  async create(createSongDto: CreateSongDto) {
    const { title, artist, genre } = createSongDto;
    const song = this.songRepository.create({ title, artist, genre });
    const savedSong = await this.songRepository.save(song);
    return savedSong;
  }

  async findAll(findAllSongDto: FindAllSongDto) {
    const { page = 1, limit = 10, title, artist } = findAllSongDto;
    const { limit: limitPage, skip } = calculatePagination(page, limit);

    const where: FindOptionsWhere<Song> = {};
    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (artist) {
      where.artist = Like(`%${artist}%`);
    }
    const [songs, count] = await this.songRepository.findAndCount({
      skip,
      take: limitPage,
      where,
    });
    return {
      data: songs,
      pagination: calculatePaginationResponse(count, page, limit),
    };
  }

  async findOne(id: number) {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) {
      throw new I18nException(
        'events.song.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }
    return song;
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) {
      throw new I18nException(
        'events.song.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }
    Object.assign(song, updateSongDto);
    const updatedSong = await this.songRepository.save(song);
    return updatedSong;
  }

  async remove(id: number) {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) {
      throw new I18nException(
        'events.song.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }
    await this.songRepository.delete(id);
    return song;
  }
}
