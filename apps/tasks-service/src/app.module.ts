import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'TASKS-SERVICE',
                transport: Transport.TCP,
                options: { port: 3000 },
            },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DbModule,
        TasksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
