import { Cron, CronOptions } from './factory'
import cron from 'node-cron'
import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sesClient } from '../internal/sesClient'
import { db } from '../internal/firebase'
import nodeConfig from 'config'

export enum EmailClient {
    AWS = 'aws',
    Nodemailer = 'nodemailer',
}

let emailCron: Cron | undefined

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

    async start(): Promise<void> {
        let enabled = await isEmailCronEnabled()
        if (enabled) {
            this.job?.start()
        }
    }
    stop(): void {
        this.job?.stop()
    }
}

export const isEmailCronEnabled = async (): Promise<boolean> => {
    const snapshot = await db.collection(nodeConfig.get('collections.cron')).doc('email').get()
    if (!snapshot.exists) {
        return false
    }

    if (!snapshot.data()?.enabled) {
        return false
    }
    
    return true
}

export const initializeEmailCron = async (options: CronOptions, client: EmailClient) => {
    emailCron = new EmailCron(options, client)
    emailCron.start()
}

export const getEmailCron = () => {
    return emailCron
}

export const setEmailCron = (cron: Cron) => {
    emailCron = cron
}