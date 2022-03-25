export class Course {
  id: number;
  name: string;
  duration: number;
  created_at: number;
  updated_at: number;

  constructor(todo?: Partial<Course>) {
    this.id = todo.id;
    this.name = todo.name;
    this.duration = todo.duration;
  }
}
