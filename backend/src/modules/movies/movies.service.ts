/* e */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Movie } from 'generated/prisma/client';
import { FindAllMoviesDto } from './dto/findAll-movies.dto';
import { calculatePagination } from '@/utils/getSkipPage';
import { MovieWhereInput } from 'generated/prisma/models';
import { calculatePaginationResponse } from '@/utils/calculatePaginationResponse';
import { I18nException } from '@/exceptions/i18n.exception';

@Injectable()
export class MoviesService {
  // constructor(private prisma: PrismaService) {}
  async create(createMovieDto: CreateMovieDto) {
    // return this.prisma.movie.create({
    //   data: createMovieDto,
    // });
  }

  async findAll(findAllMoviesDto: FindAllMoviesDto) {
    // const { page, limit, search } = findAllMoviesDto;
    // const { skip, limit: paginationLimit } = calculatePagination(page, limit);
    // const whereClause: MovieWhereInput = {};
    // if (search) {
    //   whereClause.title = { contains: search, mode: 'insensitive' };
    // }
    // const [movies, count] = await Promise.all([
    //   this.prisma.movie.findMany({
    //     skip,
    //     take: paginationLimit,
    //     where: whereClause,
    //     orderBy: {
    //       created_at: 'desc',
    //     },
    //   }),
    //   this.prisma.movie.count({
    //     where: whereClause,
    //   }),
    // ]);
    // return {
    //   data: movies,
    //   pagination: calculatePaginationResponse(count, page, paginationLimit),
    // };
  }

  async findOne(id: number) {
    // const movie = await this.prisma.movie.findUnique({
    //   where: { id },
    // });
    // if (!movie) {
    //   throw new I18nException('movie.notFound', HttpStatus.NOT_FOUND);
    // }
    // return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    // const movie = await this.prisma.movie.findUnique({
    //   where: { id },
    // });
    // if (!movie) {
    //   throw new I18nException('movie.notFound', HttpStatus.NOT_FOUND);
    // }
    // return this.prisma.movie.update({
    //   where: { id },
    //   data: updateMovieDto,
    // });
  }

  async remove(id: number) {
    // const movie = await this.prisma.movie.findUnique({
    //   where: { id },
    // });
    // if (!movie) {
    //   throw new I18nException('movie.notFound', HttpStatus.NOT_FOUND);
    // }
    // return this.prisma.movie.delete({
    //   where: { id },
    // });
  }
}
