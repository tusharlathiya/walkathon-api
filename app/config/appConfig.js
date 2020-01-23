import dotenv from 'dotenv';

dotenv.config();

export const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const DB_NAME = 'walkathon';
export const APP_SECRET = 'walkathon';

export const oktaConfig = {
    path: '/app/login/callback',
    issuer: 'passport-saml',
    entryPoint: process.env.SAML_ENTRY_POINT,
    cert: process.env.SAML_CERT,
};
