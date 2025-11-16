/* e */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FindAllMoviesDto } from './dto/findAll-movies.dto';
import { calculatePagination, calculatePaginationResponse } from '@/utils';
import { I18nException } from '@/common/exceptions/i18n.exception';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    private readonly i18n: I18nService,
  ) {}
  async create(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.save(createMovieDto);

    this.logger.log(`Movie created: ID ${movie.id} - "${movie.title}"`);

    return movie;
  }

  async findAll(findAllMoviesDto: FindAllMoviesDto) {
    const { page = 1, limit = 10, search } = findAllMoviesDto;
    const { skip, limit: paginationLimit } = calculatePagination(page, limit);
    const whereClause: FindOptionsWhere<Movie> = { is_deleted: false };

    if (search) {
      whereClause.title = ILike(`%${search}%`);
    }

    const [movies, count] = await this.movieRepository.findAndCount({
      skip,
      where: whereClause,
      take: paginationLimit,
      order: {
        created_at: 'DESC',
      },
    });

    return {
      data: movies,
      pagination: calculatePaginationResponse(count, page, paginationLimit),
    };
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!movie) {
      throw new I18nException(
        'events.movie.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!movie) {
      throw new I18nException(
        'events.movie.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    await this.movieRepository.update(id, updateMovieDto);

    this.logger.log(`Movie updated: ID ${id}`);

    return this.movieRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!movie) {
      throw new I18nException(
        'events.movie.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    movie.is_deleted = true;
    await this.movieRepository.save(movie);

    this.logger.log(`Movie ${id} soft deleted`);

    return movie;
  }
}
