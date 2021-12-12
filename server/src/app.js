import bodyParser from 'body-parser';
import Express from 'express';
import session from 'express-session';
import compression from 'compression';
import cors from 'cors';

import { apiRouter } from './routes/api';
import { staticRouter } from './routes/static';

const app = Express();

app.use(compression());
app.set('trust proxy', true);

app.use(
  session({
    proxy: true,
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb' }));

// app.use('/api/v1/.*', (req, res, next) => {
//   console.log(`req.baseUrl = ${req.baseUrl}`);
//   res.header({
//     'Cache-Control': 'max-age=0, no-transform',
//     // Connection: 'close',
//   });
//   return next();
// });
app.use(cors({
  origin: "https://wsh-2021-seakid.netlify.app",
  credentials: false,
  optionsSuccessStatus: 200,
}));

app.use('/api/v1', apiRouter);
app.use(staticRouter);

export { app };
