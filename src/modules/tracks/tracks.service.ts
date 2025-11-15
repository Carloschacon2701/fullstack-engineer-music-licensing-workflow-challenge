import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
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
import { UpdateTrackLicenseStatusDto } from './dto/updateTrackLicenseStatus-track.dto';
import { I18nService } from 'nestjs-i18n';
import { Movie } from '../movies/entities/movie.entity';

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
    private readonly i18n: I18nService,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const { scene_id, song_id, start_time_seconds, end_time_seconds } =
      createTrackDto;

    const [song, scene] = await Promise.all([
      this.songRepository.findOneBy({
        id: song_id,
        is_deleted: false,
      }),
      this.sceneRepository.findOneBy({
        id: scene_id,
        is_deleted: false,
      }),
    ]);

    if (!song) {
      throw new I18nException(
        'events.song.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    if (!scene) {
      throw new I18nException(
        'events.scene.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
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

  async findAllByMovieId(
    movieId: number,
    findAllByMovieIdTrackDto: FindAllByMovieIdTrackDto,
  ) {
    const { page = 1, limit = 10 } = findAllByMovieIdTrackDto;
    const { limit: limitPage, skip } = calculatePagination(page, limit);

    const movie = await this.movieRepository.findOneBy({
      id: movieId,
      is_deleted: false,
    });

    if (!movie) {
      throw new I18nException(
        'events.movie.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    const where: FindOptionsWhere<Track> = {
      scene: { movie_id: movie.id },
      is_deleted: false,
    };

    const [tracks, count] = await this.trackRepository.findAndCount({
      skip,
      take: limitPage,
      where,
      relations: {
        license: true,
      },
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

    const scene = await this.sceneRepository.findOneBy({
      id: sceneId,
      is_deleted: false,
    });

    if (!scene) {
      throw new I18nException(
        'events.scene.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    const where: FindOptionsWhere<Track> = {
      scene: { id: scene.id, is_deleted: false },
    };

    const [tracks, count] = await this.trackRepository.findAndCount({
      where,
      skip,
      take: limitPage,
      relations: {
        license: true,
      },
    });

    return {
      data: tracks,
      pagination: calculatePaginationResponse(count, page, limit),
    };
  }

  async findOne(id: number) {
    const track = await this.trackRepository.findOneBy({
      id,
    });

    if (!track) {
      throw new I18nException(
        'events.track.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }
    return track;
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    const { start_time_seconds, end_time_seconds } = updateTrackDto;
    const track = await this.trackRepository.findOneBy({ id });

    if (!track) {
      throw new I18nException(
        'events.track.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }
    if (start_time_seconds) {
      track.start_time_seconds = start_time_seconds;
    }
    if (end_time_seconds) {
      track.end_time_seconds = end_time_seconds;
    }

    const savedTrack = await this.trackRepository.save(track);

    return savedTrack;
  }

  async updateLicenseStatus(
    id: number,
    updateLicenseStatusDto: UpdateTrackLicenseStatusDto,
  ) {
    const { status } = updateLicenseStatusDto;
    const track = await this.trackRepository.findOne({
      where: { id, is_deleted: false },
      relations: { license: true },
      select: {
        id: true,
        license: {
          id: true,
        },
      },
    });

    if (!track) {
      throw new I18nException(
        'events.track.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    await this.licenseService.updateStatus(track.license.id, { status });
  }
  async remove(id: number) {
    const track = await this.trackRepository.findOne({
      where: { id, is_deleted: false },
      relations: { license: true },
    });

    if (!track) {
      throw new I18nException(
        'events.track.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    track.is_deleted = true;
    await this.trackRepository.save(track);

    await this.licenseService.remove(track.license.id);
  }
}
