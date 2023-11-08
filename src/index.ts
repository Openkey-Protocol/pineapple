import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import rpc from './rpc';
import upload from './upload';
import proxy from './proxy';
import { version } from '../package.json';

const app = express();
const PORT = process.env.PORT || 3000;

const commit = process.env.COMMIT_HASH || '';
const v = commit ? `${version}#${commit.substr(0, 7)}` : version;

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: false }));
app.use(cors({ maxAge: 86400 }));
app.use(compression());
app.use('/', rpc);
app.use('/', upload);
app.use('/', proxy);
app.get('/', (req, res) => res.json({ version: v, port: PORT }));

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
