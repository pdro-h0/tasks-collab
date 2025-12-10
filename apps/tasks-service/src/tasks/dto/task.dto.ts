import { Type } from 'class-transformer';
import {
    IsArray,
    IsDateString,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    ValidateNested,
} from 'class-validator';

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
    dueDate: Date;

    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    assignedUserIds?: string[];

    @IsString()
    @IsUUID('4')
    authorId: string;
}

export class createTaskDataDTO {
    @Type(() => CreateTaskDto)
    @ValidateNested()
    body: Omit<CreateTaskDto, 'authorId'>;

    @IsString()
    @IsUUID('4')
    userId: string;
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
    dueDate?: Date;

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

export class CommentTaskBodyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000, { message: 'Comment must be less than 1000 characters' })
    content: string;
}

export class CommentTaskDto {
    @Type(() => CommentTaskBodyDTO)
    @ValidateNested()
    body: CommentTaskBodyDTO;

    @IsString()
    @IsUUID('4')
    taskId: string;

    @IsString()
    @IsUUID('4')
    userId: string;
}
