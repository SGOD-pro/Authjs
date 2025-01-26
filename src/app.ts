import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes
import userRouter from './routes/auth.routes.js';

// The base path for Netlify serverless functions is `/api`
app.use('/api/user', userRouter); // Fix the route
app.get('/api', (_, res) => {
    res.send('Hello World');
});

export { app };
