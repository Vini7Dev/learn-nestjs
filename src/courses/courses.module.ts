import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CoursesRepository } from './repositories/courses-repository';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
})
export class CoursesModule { }
