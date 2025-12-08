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
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDataDto } from './dto/task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS-SERVICE') private readonly taskClient: ClientProxy,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createTask(
    @Body()
    body: CreateTaskDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const payload = { body, userId };
    const result = await firstValueFrom(
      this.taskClient.send({ cmd: 'task-created' }, payload),
    );
    return result;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDataDto,
  ) {
    const payload = { id, taskData: updateTaskDto };
    const result = await firstValueFrom(
      this.taskClient.send({ cmd: 'task-updated' }, payload),
    );
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string) {
    const payload = { id };
    const result = await firstValueFrom(
      this.taskClient.send({ cmd: 'task-deleted' }, payload),
    );
    return result;
  }
}
