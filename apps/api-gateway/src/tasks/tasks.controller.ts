import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CommentTaskBodyDto,
  CreateTaskDto,
  UpdateTaskDataDto,
} from './dto/task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS-SERVICE') private readonly taskClient: ClientProxy,
  ) {}

  @Post()
  async createTask(
    @Body()
    body: CreateTaskDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const payload = { body, userId };
    this.taskClient.emit('task:created', payload);
    return { status: 'processing' };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDataDto,
  ) {
    const payload = { id, taskData: updateTaskDto };
    this.taskClient.emit('task:updated', payload);
    return { status: 'processing' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string) {
    const payload = { id };
    this.taskClient.emit('task:deleted', payload);
    return { status: 'processing' };
  }

  @Post('new-comment/:taskId')
  async commentTask(
    @Body()
    body: CommentTaskBodyDto,
    @Param('taskId') taskId: string,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const payload = { body, taskId, userId };
    console.log(payload);
    this.taskClient.emit('comment:new', payload);
    return { status: 'processing' };
  }
}
