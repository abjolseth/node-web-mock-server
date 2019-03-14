const Utils = require('./utils/utils');
const { demo } = require('./test/demo');

const { vilkar } = require('./test/vilkar');

const Schema = require('./utils/schema-util');

const createLogDirIfnotExists = (dir) => !Utils.existsSync(dir) && Utils.mkdirSync(dir);
const LOGDIR = `${process.cwd()}/logdir`;
createLogDirIfnotExists(LOGDIR);

const SCHEMA_LOG_FILE = `${LOGDIR}/schema-errors.log`;
const log4js = require('log4js');
log4js.configure({
  appenders: { schema: { type: 'file', filename: SCHEMA_LOG_FILE } },
  categories: { default: { appenders: ['schema'], level: 'error' } }
});

const katalogMap = new Map([
  ['demo', demo],
  ['vilkar', vilkar],
]);

const testAll = () => {
  katalogMap.forEach((katalog) => katalog.testAll());
};

testAll();
console.log();
console.dir(Schema.oppsummering());
console.log('\nSchema validation completed.\n');
