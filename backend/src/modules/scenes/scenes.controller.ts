import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

  @Get()
  findAll(@Query() findAllSceneDto: FindAllSceneDto) {
    return this.scenesService.findAll(findAllSceneDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scenesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSceneDto: UpdateSceneDto) {
    return this.scenesService.update(+id, updateSceneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scenesService.remove(+id);
  }
}
