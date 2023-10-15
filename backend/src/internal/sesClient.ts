import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import nodeConfig from 'config'

const REGION: string = nodeConfig.get('aws.region') || 'us-west-2'

const SES_CONFIG = {
    apiVersion: '2010-12-01',
    region: REGION,
    accessKeyid: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}

const senderEmail = process.env.SENDER_EMAIL;

const sesClient = new SESClient(SES_CONFIG)

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/classes/sendemailcommand.html
export const sendEmail = async (recepientEmails: Array<string>, subject: string, body: string) => {
    const params = {
        Destination: {
            BccAddresses: [...recepientEmails]
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: body,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
        Source: senderEmail,
    }

    const command = new SendEmailCommand(params)
    try {
        const response = await sesClient.send(command)
        console.log('sent emails')
        console.log(response)
    } catch (error : any) {
        console.log('failed to send emails')
        console.log(error)
    }
}

export { sesClient }
