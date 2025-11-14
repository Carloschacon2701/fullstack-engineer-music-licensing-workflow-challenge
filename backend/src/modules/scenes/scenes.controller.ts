import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ScenesService } from './scenes.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { FindAllSceneDto } from './dto/findAll-scene.dto';

@Controller('scenes')
export class ScenesController {
  constructor(private readonly scenesService: ScenesService) {}

  @Post()
  create(@Body() createSceneDto: CreateSceneDto) {
    return this.scenesService.create(createSceneDto);
  }

  @Get('movie/:movie_id')
  findAllByMovie(
    @Param('movie_id', ParseIntPipe) movie_id: number,
    @Query() findAllSceneDto: FindAllSceneDto,
  ) {
    return this.scenesService.findAllByMovie(movie_id, findAllSceneDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scenesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSceneDto: UpdateSceneDto) {
    return this.scenesService.update(+id, updateSceneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scenesService.remove(+id);
  }
}
