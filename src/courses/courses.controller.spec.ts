import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

describe('CoursesController', () => {
  let coursesController: CoursesController;
  let coursesService: CoursesService;

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
      controllers: [CoursesController],
      providers: [CoursesService],
    })
      .useMocker(() => CoursesService)
      .compile();

    coursesController = module.get<CoursesController>(CoursesController);
    coursesService = module.get<CoursesService>(CoursesService);
  });

  describe('index', () => {
    it('should be able to list courses', () => {
      const spy = jest.spyOn(coursesService, 'list').mockReturnValue(templateCoursesList);

      const coursesList = coursesController.index();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(coursesList).toEqual(templateCoursesList);
    });
  });

  describe('findById', () => {
    it('should be able to find course by id', () => {
      const spy = jest.spyOn(coursesService, 'findById').mockReturnValue(singleCourseCreated);

      const findedCourse = coursesController.find('0');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(findedCourse).toEqual(singleCourseCreated);
    });

    it('should not be able to find course with a non-existent id', () => {
      const spy = jest.spyOn(coursesService, 'findById')
        .mockRejectedValue(new HttpException('Course not found!', 404) as never);

      expect(
        coursesController.find('10000')
      ).rejects.toEqual(new HttpException('Course not found!', 404));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('shoud be able to create course', () => {
      const spy = jest.spyOn(coursesService, 'create').mockReturnValue(singleCourseCreated);

      const createdCourse = coursesController.create(singleCourseData);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(createdCourse).toEqual(singleCourseCreated);
    });
  });

  describe('update', () => {
    it('should be able to update course data', () => {
      const spy = jest.spyOn(coursesService, 'update').mockReturnValue(singleCourseCreated);

      const updatedCourse = coursesController.update('0', singleCourseData);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(updatedCourse).toEqual(singleCourseCreated);
    });

    it('should not be able to update a non-existent course', () => {
      const spy = jest.spyOn(coursesService, 'update')
        .mockRejectedValue(new HttpException('Course not found!', 404) as never);

      expect(
        coursesController.update('10000', singleCourseData)
      ).rejects.toEqual(new HttpException('Course not found!', 404));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should be able to delete course', () => {
      const spy = jest.spyOn(coursesService, 'delete').mockReturnValue(0);

      const response = coursesController.delete('0');

      expect(response).toEqual(0);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('shoud not be able to delete a non-existent course', async () => {
      const spy = jest.spyOn(coursesService, 'delete')
        .mockRejectedValue(new HttpException('Course not found!', 404) as never);

      expect(
        coursesController.delete('10000')
      ).rejects.toEqual(new HttpException('Course not found!', 404));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
