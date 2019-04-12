/**
 * Npm import
 */
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

/**
 * Local import
 */
import { sanitize } from './middlewares/sanitize';
import { cors } from './middlewares/cors';
import { errors } from './middlewares/error';
import { getUser } from './middlewares/auth';


/**
 * Routes import
 */
import postRoutes from './routes/post';
import authRoutes from './routes/auth';

/**
 * Config
 */


import CONFIG from './config/config';

const app = express();

// Parse json request
app.use(bodyParser.json());

// Sanitize
app.use(sanitize);

// Enable cors request

app.use(cors);

// Find user
app.use(getUser);

// Endpoints

app.use(postRoutes);
app.use(authRoutes);

// Static serving

// Errors 
app.use(errors);


// Start server
mongoose.connect(CONFIG.mongodb_uri)
  .then(() => {
    app.listen(CONFIG.app_port , CONFIG.hostname);
  })
  .catch(err => {
    console.log(err);
  });

