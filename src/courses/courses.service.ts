import { Injectable, HttpException } from '@nestjs/common';

import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CoursesService {
  private readonly coursesList: Course[] = [];
  private currentId: number = 0;

  list(): Course[] {
    return this.coursesList;
  }

  findById(id: number) {
    const findedCourse = this.coursesList.find(course => course.id === id);

    if (!findedCourse) {
      throw new HttpException('Course not found!', 404);
    }

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

    return updatedCourse;
  }

  delete(id: number) {
    const courseIndex = this.coursesList.findIndex(course => course.id === id);

    if (courseIndex === -1) {
      throw new HttpException('Course not found!', 404);
    }

    this.coursesList.splice(courseIndex, 1);
  }
}
