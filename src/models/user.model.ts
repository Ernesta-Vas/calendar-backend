import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Todo } from './todo.model';

@Table
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  password: string;

  @HasMany(() => Todo)
  todos: Todo[];
}
