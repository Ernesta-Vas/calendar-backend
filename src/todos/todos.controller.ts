import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/models/user.model';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: Request & { user: User },
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(req.user.id, createTodoDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // findAll(@Req() req: Request & { user: User }) {
  //   return this.todosService.findAll(req.user.id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Req() req: Request & { user: User }, @Param('id') id: string) {
  //   return this.todosService.findOne(req.user.id, +id);
  // }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Req() req: Request & { user: User },
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(req.user.id, +id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: Request & { user: User }, @Param('id') id: string) {
    return this.todosService.remove(req.user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('week')
  findForWeek(
    @Req() req: Request & { user: User },
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.todosService.findForWeek(req.user.id, +startDate, +endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/updateDate')
  updateTodoDate(
    @Req() req: Request & { user: User },
    @Param('id') id: string,
    @Body() updateDateDto: { newDate: number },
  ) {
    return this.todosService.updateTodoDate(
      req.user.id,
      +id,
      updateDateDto.newDate,
    );
  }
}
