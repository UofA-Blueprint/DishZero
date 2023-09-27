import { Cron, CronOptions } from './factory'
import cron from 'node-cron'
import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sendEmail, sesClient } from '../internal/sesClient'
import { db } from '../internal/firebase'
import nodeConfig from 'config'
import { getOverdueUserEmails } from '../services/transactions'
import { getTemplate } from '../services/email'

export enum EmailClient {
    AWS = 'aws',
    Nodemailer = 'nodemailer',
}

let emailCron: Cron | undefined

export class EmailCron implements Cron {
    private job: cron.ScheduledTask | undefined
    private readonly client: EmailClient
    private readonly options: CronOptions

    constructor(options: CronOptions, client: EmailClient) {
        this.client = client || EmailClient.AWS
        this.options = options
    }

    async start(): Promise<void> {
        let enabled = await isEmailCronEnabled()
        if (enabled) {
            this.job = cron.schedule(this.options.cronExpression, async () => {
                if (this.client === EmailClient.AWS) {
                    console.log('Sending email with AWS')
                    // get overdue email addresses
                    // send the emails
                } else {
                    console.log('Sending email with nodemailer')
                }
            })
        }
    }
    stop(): void {
        this.job?.stop()
    }
}

export const isEmailCronEnabled = async () => {
    const snapshot = await db.collection(nodeConfig.get('collections.cron')).doc('email').get()
    if (!snapshot.exists) {
        return false
    }

    let data = snapshot.data()
    if (!data) {
        return false
    }
    return data.enabled
}

export const initializeEmailCron = async (options: CronOptions, client: EmailClient) => {
    emailCron = new EmailCron(options, client)
    emailCron.start()
}

export const getEmailCron = () => {
    return emailCron
}

export const setEmailCron = (cron: EmailCron) => {
    emailCron = cron
}
