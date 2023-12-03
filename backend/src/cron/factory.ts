import { EmailClient, EmailCron } from './email'

// Interface for a cron job
export interface Cron {
    start(): void
    stop(): void
}

// Options for creating a cron job
export type CronOptions = {
    cronExpression: string
    cronName?: string
}

// Factory class to create cron jobs
export class CronFactory {
    create(type: string, options: CronOptions, client?: EmailClient): Cron | undefined {
        switch (type) {
            case 'email':
                // The default client is AWS. But there is a nodemailer client as well.
                return new EmailCron(options, client || EmailClient.AWS)
        }
    }
}
