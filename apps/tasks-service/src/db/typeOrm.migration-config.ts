import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { TaskHistory } from './entities/task-history.entity';
import { Task } from './entities/task.entity';

config();

const configService = new ConfigService();
const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: Number(configService.get<number>('DB_PORT')),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [Comment, TaskHistory, Task],
    migrations: [__dirname + '/migrations/*.{js,ts}'],
    synchronize: false,
    migrationsRun: true,
    logging: true,
};

export const dataSource = new DataSource(dataSourceOptions);
