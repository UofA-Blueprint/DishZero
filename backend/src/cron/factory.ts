import { EmailCron } from "./email"

export interface Cron {
    start(options: CronOptions): void
    stop(): void
}

export type CronOptions = {
    cronExpression: string
    cronName?: string
}

export class CronFactory {
    create(type: string): Cron | undefined {
        switch (type) {
            case 'email': return new EmailCron()
        }
    }
}