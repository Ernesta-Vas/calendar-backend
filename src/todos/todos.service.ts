import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Op } from 'sequelize';
import { Todo } from 'src/models/todo.model';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo)
    private readonly todoModel: typeof Todo,
  ) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoModel.create({ ...createTodoDto, userId });
  }

  async findAll(userId: number): Promise<Todo[]> {
    return this.todoModel.findAll({ where: { userId } });
  }

  async findOne(userId: number, id: number): Promise<Todo> {
    const todo = await this.todoModel.findOne({ where: { id, userId } });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async update(
    userId: number,
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const [numberOfAffectedRows, [updatedTodo]] = await this.todoModel.update(
      { ...updateTodoDto },
      { where: { id, userId }, returning: true },
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('Todo not found');
    }
    return updatedTodo;
  }

  async remove(userId: number, id: number): Promise<void> {
    const todo = await this.findOne(userId, id);
    await todo.destroy();
  }

  async findForWeek(
    userId: number,
    startDate: number,
    endDate: number,
  ): Promise<Todo[]> {
    return this.todoModel.findAll({
      where: {
        userId,
        todoDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }

  async updateTodoDate(
    userId: number,
    todoId: number,
    newDate: number,
  ): Promise<Todo> {
    const todo = await this.todoModel.findOne({
      where: { id: todoId, userId },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    todo.todoDate = newDate;
    await todo.save();
    return todo;
  }
}
