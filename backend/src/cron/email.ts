import { Cron, CronOptions } from './factory'
import cron from 'node-cron'
import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sesClient } from '../internal/sesClient'

export enum EmailClient {
    AWS = 'aws',
    Nodemailer = 'nodemailer',
}

export class EmailCron implements Cron {
    private job: cron.ScheduledTask

    constructor(options: CronOptions, client: EmailClient) {
        this.job = cron.schedule(options.cronExpression, () => {
            if (client === EmailClient.AWS) {
                console.log('Sending email from AWS')
            } else if (client === EmailClient.Nodemailer) {
                console.log('Sending email from nodemailer')
            }
        })
    }

    start(): void {
        this.job?.start()
    }
    stop(): void {
        this.job?.stop()
    }
}
