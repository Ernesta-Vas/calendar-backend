import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { Todo } from '../models/todo.model';

@Module({
  imports: [SequelizeModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
