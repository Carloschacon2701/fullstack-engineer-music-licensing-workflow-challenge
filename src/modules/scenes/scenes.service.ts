import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scene } from './entities/scene.entity';
import { FindAllSceneDto } from './dto/findAll-scene.dto';
import { calculatePagination, calculatePaginationResponse } from '@/utils';
import { I18nException } from '@/common/exceptions/i18n.exception';
import { Movie } from '../movies/entities/movie.entity';
import { I18nService } from 'nestjs-i18n';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ScenesService {
  private readonly logger = new Logger(ScenesService.name);

  constructor(
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private readonly i18n: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createSceneDto: CreateSceneDto) {
    const { movie_id, title, description } = createSceneDto;
    const cacheKey = `scenes:movie:${movie_id}`;
    const movie = await this.movieRepository.findOneBy({
      id: movie_id,
      is_deleted: false,
    });

    if (!movie) {
      throw new I18nException(
        'events.movie.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    const scene = this.sceneRepository.create({
      movie_id,
      title,
      description,
    });

    const savedScene = await this.sceneRepository.save(scene);

    this.logger.log(
      `Scene created: ID ${savedScene.id} - "${title}" for movie ${movie_id}`,
    );

    await this.cacheManager.del(cacheKey);

    return savedScene;
  }

  async findAllByMovie(movie_id: number, findAllSceneDto: FindAllSceneDto) {
    const { limit = 10, page = 1 } = findAllSceneDto;
    const { skip, limit: paginationLimit } = calculatePagination(page, limit);
    const cacheKey = `scenes:movie:${movie_id}:page:${page}:limit:${limit}`;

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const [scenes, total] = await this.sceneRepository.findAndCount({
      skip,
      take: paginationLimit,
      where: { movie_id, is_deleted: false },
      order: {
        created_at: 'DESC',
      },
    });

    const pagination = calculatePaginationResponse(
      total,
      page,
      paginationLimit,
    );

    const response = {
      data: scenes,
      pagination,
    };

    await this.cacheManager.set(cacheKey, response, 60000); // 1 minute

    return response;
  }

  async findOne(id: number) {
    const scene = await this.sceneRepository.findOneBy({
      id,
      is_deleted: false,
    });
    if (!scene) {
      throw new I18nException(
        'events.scene.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }
    return scene;
  }

  async update(id: number, updateSceneDto: UpdateSceneDto) {
    const scene = await this.sceneRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!scene) {
      throw new I18nException(
        'events.scene.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }

    const cacheKey = `scenes:movie:${scene.movie_id}`;

    await this.sceneRepository.update(id, updateSceneDto);

    this.logger.log(`Scene updated: ID ${id}`);

    await this.cacheManager.del(cacheKey);

    return this.findOne(id);
  }

  async remove(id: number) {
    const scene = await this.sceneRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!scene) {
      throw new I18nException(
        'events.scene.notFound',
        HttpStatus.NOT_FOUND,
        this.i18n,
      );
    }
    const cacheKey = `scenes:movie:${scene.movie_id}`;

    scene.is_deleted = true;
    await this.sceneRepository.save(scene);

    this.logger.log(`Scene ${id} soft deleted`);

    await this.cacheManager.del(cacheKey);

    return scene;
  }
}
