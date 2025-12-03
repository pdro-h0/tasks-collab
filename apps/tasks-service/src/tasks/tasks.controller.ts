import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksRepo: TasksRepository) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const userId = req.user.userId;
    return this.tasksRepo.create({ ...createTaskDto, authorId: userId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksRepo.getById({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksRepo.update({ id, taskData: updateTaskDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksRepo.delete({ id });
  }
}
