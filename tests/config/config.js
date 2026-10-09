import 'dotenv/config.js'

const requiredVariables = [
    'BASE_URL',
    'API_USERNAME',
    'API_PASSWORD'
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable: ${variable}`
        );
    }
}

export const config = {
    baseUrl: process.env.BASE_URL,
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD

}