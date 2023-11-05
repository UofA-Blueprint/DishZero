import { Cron, CronOptions } from './factory'
import cron from 'node-cron'
import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sendEmail, sesClient } from '../internal/sesClient'
import { db } from '../internal/firebase'
import nodeConfig from 'config'
import { getTemplate } from '../services/email'
import Logger from '../utils/logger'
import { getAllDishes } from '../services/dish'
import { getUserById } from '../services/users'

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
                    Logger.info({
                        message: 'Sending email with AWS',
                    })

                    // get overdue email addresses
                    const oneHour = 1000 * 3600 // hours
                    let recipients = []
                    const dishes = await getAllDishes()
                    for (const dish of dishes) {
                        if (dish.borrowed && dish.userId && dish.borrowedAt) {
                            const currentTime = new Date()
                            const borrowedDate = new Date(dish.borrowedAt.toString())
                            const hoursSinceBorrow = Math.abs(currentTime.getTime() - borrowedDate.getTime()) / oneHour

                            if (hoursSinceBorrow > 48) {
                                const user = await getUserById(dish.userId)
                                if (user?.email == process.env.SENDER_EMAIL) {
                                        recipients.push(user?.email)
                                }
                            }
                        }
                    }

                    recipients = [... new Set(recipients)]
                    
                    const template = await getTemplate()
                    const subject = template.subject
                    const body = template.body

                    if (recipients.length > 0) {
                        // send the emails
                        console.log('Sending emails using AWS')
                        Logger.info({
                            message: 'sending emails',
                            recipients,
                        })
                    sendEmail(recipients, subject, body)
                    } else {
                        Logger.info({
                            message: "no users have overdue dish"
                        })
                    }
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
