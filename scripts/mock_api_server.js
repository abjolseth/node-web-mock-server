const express = require('express');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');
const nodeCache = new NodeCache();
global.nodeCache = nodeCache;

const Utils = require('./utils/utils');
const serverinfo = require('./utils/server-info');
const logging = require('./utils/logging');

const saksbehandler = require('./modules/saksbehandler');
const vilkar = require('./modules/vilkar');

const createLogDirIfnotExists = (dir) => !Utils.existsSync(dir) && Utils.mkdirSync(dir);
const LOGDIR = `${process.cwd()}/logdir`;
createLogDirIfnotExists(LOGDIR);

const MOCK_LOG_FILE = `${LOGDIR}/mock-errors.log`;
const WEB_MOCK_LOG_FILE = `${LOGDIR}/web-mock-errors.log`;
const log4js = require('log4js');
log4js.configure({
  appenders: {
    mock: { type: 'file', filename: MOCK_LOG_FILE, maxLogSize: 10485760, backups: 3, compress: true },
    webmock: { type: 'file', filename: WEB_MOCK_LOG_FILE, maxLogSize: 10485760, backups: 3, compress: true }
  },
  categories: { default: { appenders: ['mock','webmock'], level: 'debug' } }
});

const app = express();

const allowCrossDomain = (req, res, next)  => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const port = process.env.PORT || 3002;
const router = express.Router();

/**
/**
 * SAKSBEHANDLER
 */
router.get('/saksbehandler', saksbehandler.hent);

/*
 * VILKÅR
 * ---------------------------------------------------------------
 */
router.get('/vilkaar/:behandlingID', vilkar.hent);
router.post('/vilkaar/:behandlingID', vilkar.send);

// router.post('/logger/trace', logging.trace);
// router.post('/logger/debug', logging.debug);
router.post('/logger/info', logging.info);
router.post('/logger/warn', logging.warn);
router.post('/logger/error', logging.error);

app.use(allowCrossDomain);
app.use('/api', router);
app.use('/frontendlogger', express.static('static'));

app.listen(port);

/* eslint-disable-next-line no-console */
console.log('Test MeloSys mock API server running on http://'+serverinfo.getIpAdress()+':' + port+'/api');
