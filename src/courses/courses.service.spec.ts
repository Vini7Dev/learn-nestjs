import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CoursesService } from './courses.service';
import { CoursesRepository } from './repositories/courses-repository';

describe('CoursesService', () => {
  let coursesService: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService, EventEmitter2, CoursesRepository],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
  });

  it('should be able to create a new course', () => {
    const courseExampleData = {
      name: 'Example',
      duration: 100,
    };

    const courseCreated = coursesService.create(courseExampleData);

    expect(courseCreated).toHaveProperty('id', 0);
    expect(courseCreated).toHaveProperty('name', 'Example');
    expect(courseCreated).toHaveProperty('duration', 100);
  });

  it('should be able to list all courses', () => {
    const firstCourseExampleData = {
      name: 'Example 1',
      duration: 100
    };

    const secondCourseExampleData = {
      name: 'Example 2',
      duration: 200,
    }

    coursesService.create(firstCourseExampleData);
    coursesService.create(secondCourseExampleData);

    const coursesList = coursesService.list();

    expect(coursesList).toHaveLength(2);
    expect(coursesList[0]).toHaveProperty('id', 0);
    expect(coursesList[1]).toHaveProperty('id', 1);
  });

  it('shoud be able to find course by id', () => {
    const courseExampleData = {
      name: 'Example',
      duration: 100,
    };

    const courseCreated = coursesService.create(courseExampleData);

    const courseFinded = coursesService.findById(courseCreated.id);

    expect(courseFinded).toHaveProperty('id', 0);
    expect(courseFinded).toHaveProperty('name', 'Example');
    expect(courseFinded).toHaveProperty('duration', 100);
  });

  it('should be able to update a course date', () => {
    const courseExampleData = {
      name: 'Example',
      duration: 100,
    };

    const courseCreated = coursesService.create(courseExampleData);

    const courseUpdated = coursesService.update({
      id: courseCreated.id,
      name: 'Updated Course Name',
      duration: 200,
    });

    expect(courseUpdated).toHaveProperty('id', 0);
    expect(courseUpdated.name).toEqual('Updated Course Name');
    expect(courseUpdated.duration).toEqual(200);
  });

  it('shoud be able to delete a course', () => {
    const courseExampleData = {
      name: 'Example',
      duration: 100,
    };

    const courseCreated = coursesService.create(courseExampleData);

    const response = coursesService.delete(courseCreated.id);

    expect(response).toEqual(courseCreated.id);
  });
});
