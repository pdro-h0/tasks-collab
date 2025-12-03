import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsIn,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  @IsDateString()
  dueDate: string | Date;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  assignedUserIds?: string[];

  @IsString()
  @IsUUID('4')
  authorId: string;
}

class UpdateTaskDataDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
  @IsOptional()
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  @IsOptional()
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  @IsDateString()
  @IsOptional()
  dueDate?: string | Date;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  assignedUserIds?: string[];
}

export class UpdateTaskDto {
  @IsString()
  @IsUUID('4')
  id: string;

  @Type(() => UpdateTaskDataDto)
  @ValidateNested()
  taskData: UpdateTaskDataDto;
}

export class TaskIdParamDto {
  @IsString()
  @IsUUID('4')
  id: string;
}

export class GetTaskByIdDto extends TaskIdParamDto {}

export class DeleteTaskDto extends TaskIdParamDto {}
