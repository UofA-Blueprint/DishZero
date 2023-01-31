const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    PORT,
    EMAIL_SERVICE,
    EMAIL_USER,
    EMAIL_PASS
} = process.env;

const emailConfig = {
    service: EMAIL_SERVICE,
    user: EMAIL_USER,
    pass: EMAIL_PASS,
};

module.exports = {
    emailConfig,    
}