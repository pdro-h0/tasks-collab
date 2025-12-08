/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Logger } from '@nestjs/common';
import {
    Ctx,
    MessagePattern,
    Payload,
    RmqContext,
} from '@nestjs/microservices';

@Controller()
export class RabbitMQController {
    private readonly logger = new Logger(RabbitMQController.name);

    @MessagePattern('task:created')
    async handleNotification(@Payload() data: any, @Ctx() context: RmqContext) {
        try {
            this.logger.log(`Received notification: ${JSON.stringify(data)}`);
            const channel = context.getChannelRef();
            const originalMsg = context.getMessage();

            channel.ack(originalMsg);
            return { status: 'processed', data };
        } catch (error) {
            this.logger.error(
                `Error processing notification: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}
