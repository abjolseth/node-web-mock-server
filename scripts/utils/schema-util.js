const glob = require('glob');
const log4js = require('log4js');
const logger = log4js.getLogger('schema');
const colors = require('colors/safe');
const emoji = require('node-emoji');

const { MOCK_DATA_DIR, SCHEMA_DIR, DEFINITION_SCHEMA } = require('../../mock.config');
const Utils = require('./utils');

const oppsummering = {
  success: 0,
  failure: 0,
};

const incSuccess = () => {
  oppsummering.success += 1;
};
const incFailure = () => {
  oppsummering.failure += 1;
};

module.exports.oppsummering = () => {
  return oppsummering;
};

module.exports.lesSchemaSync = schemapath => {
  return Utils.readJsonAndParseSync(schemapath);
};
module.exports.lesSchemaFileSync = schemafile => {
  const schemapath = `${SCHEMA_DIR}/${schemafile}`;
  return Utils.readJsonAndParseSync(schemapath);
};
module.exports.lesSchemaDefinitonsSync = () => {
  return Utils.readJsonAndParseSync(DEFINITION_SCHEMA);
};

module.exports.lesSchemaDefinitonsAsync = async () => {
  return Utils.readJsonAndParseAsync(DEFINITION_SCHEMA);
};
const humanReadableErrors = (allErrors = []) => {
  return allErrors.map(singleError => {
    const { keyword = '', dataPath = '', params = {}, message = '' } = singleError;
    const { additionalProperty } = params;
    const baseText = `[${keyword.toUpperCase()}] ${dataPath}: ${message}`;
    return additionalProperty ? `${baseText}: ${additionalProperty}` : baseText;
  })
};

const katalogNavn = path => {
  const splits = path.slice(MOCK_DATA_DIR.length+1).split('/');
  return splits.slice(0,splits.length-1).join('/');
};
module.exports.katalogNavn = katalogNavn;

module.exports.katalogTittel = path => {
  const katalog = katalogNavn(path);
  return katalog.charAt(0).toLocaleUpperCase() + katalog.slice(1);
};

module.exports.lesKatalogSync = dirpath => {
  let catalog = [];
  const files = glob.sync('*.json', {
    cwd: dirpath,
    ignore: 'schema.json$'
  });
  files.forEach(navn => {
    const filepath = `${dirpath}/${navn}`;
    const document = Utils.readJsonAndParseSync(filepath);
    catalog.push({
      navn,
      document
    });
  });
  return catalog;
};

module.exports.lesKatalogElement = path => {
  const document =  Utils.readJsonAndParseSync(path);
  const dirs = path.split('/');
  const navn = dirs[dirs.length-1];
  return {
    navn,
    document,
  };
};

module.exports.runTest = (data, ajv, validate) => {
  const { navn, document } = data;
  const valid = validate(document);
  if (valid) {
    incSuccess();
    console.log(' ',emoji.get('ballot_box_with_check'),' ',colors.green(navn));
  }
  else {
    incFailure();
    console.log(colors.red('\tInvalid: '+navn));
    humanReadableErrors(validate.errors).forEach((msg, index) => {
      console.log('\t', (index < 10 ? ` ${index}` : index), msg);
      logger.error(`${navn} ${msg}`);
    });
  }
};

module.exports.prettyTittel = label => {
  console.log(colors.white(label));
};
