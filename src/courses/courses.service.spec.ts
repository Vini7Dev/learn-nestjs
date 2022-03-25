import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CoursesService } from './courses.service';
import { CoursesRepository } from './repositories/courses-repository';
import { Course } from './entities/course.entity';
import { HttpException } from '@nestjs/common';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let coursesRepository: CoursesRepository;

  const singleCourseCreated = new Course({
    id: 0,
    name: 'Example',
    duration: 100,
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  const singleCourseData = new Course({ name: 'Example', duration: 100 });

  const templateCoursesList = [singleCourseCreated, singleCourseCreated];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService, EventEmitter2, CoursesRepository],
    })
      .useMocker(() => EventEmitter2)
      .useMocker(() => CoursesRepository)
      .compile();

    coursesService = module.get<CoursesService>(CoursesService);
    coursesRepository = module.get<CoursesRepository>(CoursesRepository);
  });

  describe('list', () => {
    it('should be able to list courses', () => {
      const spy = jest.spyOn(coursesRepository, 'list').mockReturnValue(templateCoursesList);

      const coursesList = coursesService.list();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(coursesList).toEqual(templateCoursesList);
    });
  });

  describe('findById', () => {
    it('should be able to find course by id', () => {
      const spy = jest.spyOn(coursesRepository, 'findById').mockReturnValue(singleCourseCreated);

      const response = coursesService.findById(0);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(singleCourseCreated);
    });

    it('should not be able to find course with a non-existent id', () => {
      const spy = jest.spyOn(coursesRepository, 'findById')
        .mockRejectedValue(new HttpException('Course not found!', 404) as never);

      expect(
        coursesService.findById(1000)
      ).rejects.toEqual(new HttpException('Course not found!', 404));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should be able to create course', () => {
      const spy = jest.spyOn(coursesRepository, 'create').mockReturnValue(singleCourseCreated);

      const response = coursesService.create(singleCourseData);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(singleCourseCreated);
    });
  });

  describe('update', () => {
    it('should be able to update course data', () => {
      const spy = jest.spyOn(coursesRepository, 'update').mockReturnValue(singleCourseCreated);

      const response = coursesService.update(singleCourseCreated);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(singleCourseCreated);
    });

    it('should not be able to update a non-existent course', () => {
      const spy = jest.spyOn(coursesRepository, 'update')
        .mockRejectedValue(new HttpException('Course not found!', 404) as never);

      expect(
        coursesService.update(singleCourseCreated)
      ).rejects.toEqual(new HttpException('Course not found!', 404));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be able to delete course', () => {
      const spy = jest.spyOn(coursesRepository, 'delete').mockReturnValue(0);

      const response = coursesService.delete(0);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(response).toEqual(0);
    });

    it('should not be able to delete a non-existent course', () => {
      const spy = jest.spyOn(coursesRepository, 'delete')
        .mockRejectedValue(new HttpException('Course not found!', 404) as never);

      expect(
        coursesService.delete(1000)
      ).rejects.toStrictEqual(new HttpException('Course not found!', 404));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
