import { IsString, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly duration: number;
}
