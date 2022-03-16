import { Body, Controller, Get, Param, Post, Put, Res, Delete } from '@nestjs/common';
import { Response } from 'express';

import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get()
  list(@Res() res: Response): Response {
    const coursesList = this.coursesService.list();

    return res.json(coursesList);
  }

  @Get('/:id')
  find(
    @Param('id') id: string,
    @Res() res: Response,
  ): Response {
    const findedCourse = this.coursesService.findById(parseInt(id));

    return res.json(findedCourse);
  }

  @Post()
  create(@Body() data: CreateCourseDto, @Res() res: Response): Response<Course> {
    const createdCourse = this.coursesService.create(data);

    return res.json(createdCourse).status(201);
  }

  @Put('/:id')
  update(
    @Param('id')
    id: string,
    @Body()
    data: UpdateCourseDto,
    @Res() res: Response
  ): Response<Course> {
    const updatedCourse = this.coursesService.update({
      ...data,
      id: parseInt(id),
    });

    return res.json(updatedCourse);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Res() res: Response): Response {
    this.coursesService.delete(parseInt(id));

    return res.status(200).json({ message: 'Course ' + id + ' removed!' });
  }
}
