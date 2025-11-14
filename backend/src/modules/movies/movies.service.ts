/* e */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FindAllMoviesDto } from './dto/findAll-movies.dto';
import { calculatePagination } from '@/utils/getSkipPage';
import { calculatePaginationResponse } from '@/utils/calculatePaginationResponse';
import { I18nException } from '@/common/exceptions/i18n.exception';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
  ) {}
  async create(createMovieDto: CreateMovieDto) {
    return this.movieRepository.save(createMovieDto);
  }

  async findAll(findAllMoviesDto: FindAllMoviesDto) {
    const { page = 1, limit = 10, search } = findAllMoviesDto;
    const { skip, limit: paginationLimit } = calculatePagination(page, limit);
    const whereClause: FindOptionsWhere<Movie> = {};

    if (search) {
      whereClause.title = Like(`%${search}%`);
    }

    const [movies, count] = await Promise.all([
      this.movieRepository.find({
        skip,
        where: whereClause,
        take: paginationLimit,
        order: {
          created_at: 'DESC',
        },
      }),
      this.movieRepository.count({ where: whereClause }),
    ]);
    return {
      data: movies,
      pagination: calculatePaginationResponse(count, page, paginationLimit),
    };
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new I18nException('movie.notFound', HttpStatus.NOT_FOUND);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      throw new I18nException('movie.notFound', HttpStatus.NOT_FOUND);
    }
    return this.movieRepository.update(id, updateMovieDto);
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new I18nException('movie.notFound', HttpStatus.NOT_FOUND);
    }
    return this.movieRepository.delete(id);
  }
}
