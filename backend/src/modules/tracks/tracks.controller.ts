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
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FindAllTrackDto } from './dto/findAll-track.dto';
import { FindAllBySceneIdTrackDto } from './dto/findAllBySceneID-track.dto';
import { FindAllByMovieIdTrackDto } from './dto/findAllByMovieID-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll(@Query() findAllTrackDto: FindAllTrackDto) {
    return this.tracksService.findAll(findAllTrackDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(+id);
  }

  @Get('scene/:sceneId')
  findAllBySceneId(
    @Param('sceneId', ParseIntPipe) sceneId: number,
    @Query() findAllBySceneIdTrackDto: FindAllBySceneIdTrackDto,
  ) {
    return this.tracksService.findAllBySceneId(
      sceneId,
      findAllBySceneIdTrackDto,
    );
  }

  @Get('movie/:movieId')
  findAllByMovieId(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query() findAllByMovieIdTrackDto: FindAllByMovieIdTrackDto,
  ) {
    return this.tracksService.findAllByMovieId(
      movieId,
      findAllByMovieIdTrackDto,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tracksService.remove(+id);
  }
}
