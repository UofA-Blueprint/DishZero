import { Cron, CronOptions } from "./factory";
import cron from 'node-cron'

export class EmailCron implements Cron {

    private job: cron.ScheduledTask | undefined

    start(options: CronOptions): void {
        this.job = cron.schedule(options.cronExpression, () => {
            console.log('running a cron task')
        })
    }
    stop(): void {
        this.job?.stop()
    }
}