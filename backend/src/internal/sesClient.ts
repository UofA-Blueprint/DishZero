import { SESClient } from '@aws-sdk/client-ses'
import nodeConfig from 'config'

const REGION: string = nodeConfig.get('aws.region') || 'us-west-2'

const sesClient = new SESClient({ region: REGION })

export { sesClient }
