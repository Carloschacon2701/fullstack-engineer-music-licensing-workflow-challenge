import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FindAllTrackDto } from './dto/findAll-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { FindAllByMovieIdTrackDto } from './dto/findAllByMovieID-track.dto';
import { calculatePagination } from '@/utils/getSkipPage';
import { calculatePaginationResponse } from '@/utils/calculatePaginationResponse';
import { FindAllBySceneIdTrackDto } from './dto/findAllBySceneID-track.dto';
import { Song } from '../songs/entities/song.entity';
import { Scene } from '../scenes/entities/scene.entity';
import { I18nException } from '@/common/exceptions/i18n.exception';
import { LicensesService } from '../licenses/licenses.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
    private licenseService: LicensesService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const { scene_id, song_id, start_time_seconds, end_time_seconds } =
      createTrackDto;

    const [song, scene] = await Promise.all([
      this.songRepository.findOneBy({
        id: song_id,
      }),
      this.sceneRepository.findOneBy({
        id: scene_id,
      }),
    ]);

    if (!song) {
      throw new I18nException('song.notFound', HttpStatus.NOT_FOUND);
    }

    if (!scene) {
      throw new I18nException('scene.notFound', HttpStatus.NOT_FOUND);
    }

    const track = this.trackRepository.create({
      scene,
      song,
      start_time_seconds,
      end_time_seconds,
    });

    const savedTrack = await this.trackRepository.save(track);
    await this.licenseService.create({ track_id: savedTrack.id });

    return savedTrack;
  }

  async findAll(findAllTrackDto: FindAllTrackDto) {
    const { page = 1, limit = 10 } = findAllTrackDto;
    const { limit: limitPage, skip } = calculatePagination(page, limit);

    const [tracks, count] = await this.trackRepository.findAndCount({
      skip,
      take: limitPage,
    });

    return {
      data: tracks,
      pagination: calculatePaginationResponse(count, page, limit),
    };
  }

  async findAllByMovieId(
    movieId: number,
    findAllByMovieIdTrackDto: FindAllByMovieIdTrackDto,
  ) {
    const { page = 1, limit = 10 } = findAllByMovieIdTrackDto;
    const { limit: limitPage, skip } = calculatePagination(page, limit);

    const where: FindOptionsWhere<Track> = { scene: { movie_id: movieId } };

    const [tracks, count] = await this.trackRepository.findAndCount({
      skip,
      take: limitPage,
      where,
    });

    return {
      data: tracks,
      pagination: calculatePaginationResponse(count, page, limit),
    };
  }

  async findAllBySceneId(
    sceneId: number,
    findAllBySceneIdTrackDto: FindAllBySceneIdTrackDto,
  ) {
    const { page = 1, limit = 10 } = findAllBySceneIdTrackDto;
    const { limit: limitPage, skip } = calculatePagination(page, limit);
    const where: FindOptionsWhere<Track> = { scene: { id: sceneId } };

    const [tracks, count] = await this.trackRepository.findAndCount({
      where,
      skip,
      take: limitPage,
    });

    return {
      data: tracks,
      pagination: calculatePaginationResponse(count, page, limit),
    };
  }

  async findOne(id: number) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new I18nException('track.notFound', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    const { start_time_seconds, end_time_seconds } = updateTrackDto;
    const track = await this.trackRepository.findOneBy({ id });

    if (!track) {
      throw new I18nException('track.notFound', HttpStatus.NOT_FOUND);
    }
    if (start_time_seconds) {
      track.start_time_seconds = start_time_seconds;
    }
    if (end_time_seconds) {
      track.end_time_seconds = end_time_seconds;
    }
    const savedTrack = await this.trackRepository.save(track);
    await this.licenseService.create({ track_id: savedTrack.id });

    return savedTrack;
  }

  async remove(id: number) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new I18nException('track.notFound', HttpStatus.NOT_FOUND);
    }
    await this.trackRepository.delete(id);
  }
}
