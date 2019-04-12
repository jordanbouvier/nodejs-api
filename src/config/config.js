/**
 * Node import
 */
import fs from 'fs';
import path from 'path';

/**
 * Npm import
 */
import dotenv from 'dotenv';

dotenv.config();

const publicKeyPath = path.join(__dirname, 'keys', 'public.pem');
const privateKeyPath = path.join(__dirname, 'keys', 'private.pem');

/**
 * Config
 */
const config =  {
  development: {
    mongodb_uri: "mongodb+srv://jordan:xjOjxUYZu9pgd5wD@cluster0-xjww5.mongodb.net/test?retryWrites=true",
    app_port: 8080,
    hostname: '192.168.1.33',
    mailer_url: '',
    jwt_key_passphrase: '72421664573c001359c19a14e502821e',
    jwt_private_key: fs.readFileSync(privateKeyPath),
    jwt_public_key: fs.readFileSync(publicKeyPath),
  },
  production: {
    env: 'prod',
  }
}
const env = process.env.NODE_ENV;
const exportedConfig = config[env] ? config[env] : config.production;


/**
 * Export
 */
export default exportedConfig;


