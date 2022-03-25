import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';

import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get()
  index(): Course[] {
    const coursesList = this.coursesService.list();

    return coursesList;
  }

  @Get('/:id')
  find(@Param('id') id: string): Course {
    const findedCourse = this.coursesService.findById(parseInt(id));

    return findedCourse;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateCourseDto): Course {
    const createdCourse = this.coursesService.create(data);

    return createdCourse;
  }

  @Put('/:id')
  update(
    @Param('id')
    id: string,
    @Body()
    data: Omit<UpdateCourseDto, 'id'>
  ): Course {
    const updatedCourse = this.coursesService.update({
      ...data,
      id: parseInt(id),
    });

    return updatedCourse;
  }

  @Delete('/:id')
  delete(@Param('id') id: string): number {
    const response = this.coursesService.delete(parseInt(id));

    return response;
  }
}
