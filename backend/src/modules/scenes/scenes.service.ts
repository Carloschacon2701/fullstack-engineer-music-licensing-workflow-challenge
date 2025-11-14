import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scene } from './entities/scene.entity';
import { FindAllSceneDto } from './dto/findAll-scene.dto';
import { calculatePagination } from '@/utils/getSkipPage';
import { calculatePaginationResponse } from '@/utils/calculatePaginationResponse';
import { I18nException } from '@/common/exceptions/i18n.exception';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class ScenesService {
  constructor(
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(createSceneDto: CreateSceneDto) {
    const { movie_id, title, description } = createSceneDto;
    const movie = await this.movieRepository.findOneBy({ id: movie_id });

    if (!movie) {
      throw new I18nException('movie.notFound', HttpStatus.NOT_FOUND);
    }

    const scene = this.sceneRepository.create({
      movie_id,
      title,
      description,
    });

    await this.sceneRepository.save(scene);

    return scene;
  }

  async findAllByMovie(movie_id: number, findAllSceneDto: FindAllSceneDto) {
    const { limit = 10, page = 1 } = findAllSceneDto;
    const { skip } = calculatePagination(page, limit);

    const [scenes, total] = await this.sceneRepository.findAndCount({
      skip,
      take: limit,
      where: { movie_id },
    });
    return {
      data: scenes,
      pagination: calculatePaginationResponse(total, page, limit),
    };
  }

  async findOne(id: number) {
    const scene = await this.sceneRepository.findOneBy({ id });
    if (!scene) {
      throw new I18nException('scene.notFound', HttpStatus.NOT_FOUND);
    }
    return scene;
  }

  async update(id: number, updateSceneDto: UpdateSceneDto) {
    const scene = await this.sceneRepository.findOneBy({ id });
    if (!scene) {
      throw new I18nException('scene.notFound', HttpStatus.NOT_FOUND);
    }
    await this.sceneRepository.update(id, updateSceneDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const scene = await this.sceneRepository.findOneBy({ id });
    if (!scene) {
      throw new I18nException('scene.notFound', HttpStatus.NOT_FOUND);
    }
    await this.sceneRepository.delete(id);
    return scene;
  }
}
