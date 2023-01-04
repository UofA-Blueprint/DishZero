import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const {
    PORT,
    EMAIL_SERVICE,
    EMAIL_USER,
    EMAIL_PASS
} = process.env;


export default {
    emailConfig: {
        service: EMAIL_SERVICE,
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    }
}