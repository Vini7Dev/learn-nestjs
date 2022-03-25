import { Injectable, HttpException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, Interval } from '@nestjs/schedule';

import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { CoursesRepository } from './repositories/courses-repository';

@Injectable()
export class CoursesService {
  private timer: number = 0;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly coursesRepository: CoursesRepository,
  ) { }

  @Interval(1000)
  runTimer() {
    this.timer += 1;
  }

  list(): Course[] {
    const coursesList = this.coursesRepository.list();

    this.eventEmitter.emit('courses.list', coursesList);

    return coursesList;
  }

  findById(id: number) {
    const findedCourse = this.coursesRepository.findById(id);

    this.eventEmitter.emit('courses.findById', findedCourse);

    return findedCourse;
  }

  create(data: CreateCourseDto) {
    const createdCourse = this.coursesRepository.create(data);

    this.eventEmitter.emit('courses.create', createdCourse);

    return createdCourse;
  }

  update(data: UpdateCourseDto) {
    const updatedCourse = this.coursesRepository.update(data);

    this.eventEmitter.emit('courses.update', updatedCourse);

    return updatedCourse;
  }

  delete(id: number) {
    this.coursesRepository.delete(id);

    this.eventEmitter.emit('courses.delete', { message: `Course ${id} deleted!` });

    return id;
  }

  @OnEvent('courses.*')
  handleCourseCreated(payload: any) {
    console.log('==> Escutou o evento courses.* <==');
    console.log('Payload:', payload);
  }

  @Cron('* * * * *')
  everyMinuteListAllCourses() {
    const result = this.list();

    console.log('==> EveryMinuteListAllCourses <==')
    console.log('List:', result);
    console.log('Timer:', this.timer)
  }
}
