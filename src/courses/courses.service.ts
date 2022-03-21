import { Injectable, HttpException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, Interval } from '@nestjs/schedule';

import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CoursesService {
  private readonly coursesList: Course[] = [];
  private currentId: number = 0;
  private timer: number = 0;

  constructor(private readonly eventEmitter: EventEmitter2) { }

  @Interval(1000)
  runTimer() {
    this.timer += 1;
  }

  list(): Course[] {
    this.eventEmitter.emit('courses.list', this.coursesList);

    return this.coursesList;
  }

  findById(id: number) {
    const findedCourse = this.coursesList.find(course => course.id === id);

    if (!findedCourse) {
      throw new HttpException('Course not found!', 404);
    }

    this.eventEmitter.emit('courses.findById', findedCourse);

    return findedCourse;
  }

  create(data: CreateCourseDto) {
    const createdCourse = {
      ...data,
      id: this.currentId,
      created_at: Date.now(),
      updated_at: Date.now()
    };

    this.coursesList.push(createdCourse);

    this.currentId += 1;

    this.eventEmitter.emit('courses.create', createdCourse);

    return createdCourse;
  }

  update(data: UpdateCourseDto) {
    const courseIndex = this.coursesList.findIndex(course => course.id === data.id);

    if (courseIndex === -1) {
      throw new HttpException('Course not found!', 404);
    }

    const updatedCourse = this.coursesList[courseIndex];

    Object.assign(updatedCourse, {
      ...data,
      updated_at: Date.now(),
    });

    this.coursesList[courseIndex] = updatedCourse;

    this.eventEmitter.emit('courses.update', updatedCourse);

    return updatedCourse;
  }

  delete(id: number) {
    const courseIndex = this.coursesList.findIndex(course => course.id === id);

    if (courseIndex === -1) {
      throw new HttpException('Course not found!', 404);
    }

    this.coursesList.splice(courseIndex, 1);

    this.eventEmitter.emit('courses.delete', { message: `Course ${id} deleted!` });
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
