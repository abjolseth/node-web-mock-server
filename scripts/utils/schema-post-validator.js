const Ajv = require('ajv');
const colors = require('colors/safe');
const emoji = require('node-emoji');

const ERR = require('./errors');

const Schema = require('./schema-util');

module.exports.valideringFeil = (req, res) => {
  const status = 400;
  const melding = ERR.errorMessage(400,'Bad Request', 'Invalid schema', req.originalUrl);
  res.status(status).send(melding);
};

const humanReadableErrors = (allErrors = []) => {
  return allErrors.map(singleError => {
    const { keyword = '', dataPath = '', params = {}, message = '' } = singleError;
    const { additionalProperty } = params;
    const baseText = `[${colors.bgMagenta(keyword.toUpperCase())}] ${dataPath}: ${message}`;
    return additionalProperty ? `${baseText}: '${colors.bgRed(additionalProperty)}'` : baseText;
  })
};

module.exports.testAsync = async (label, schema, data) => {
  if (!label) {
    console.log(colors.bgYellow('schema:test, mangler label'));
    return false;
  }
  if (!schema) {
    console.log(colors.bgYellow('schema:test, mangler schema'));
    return false;
  }

  const ajv = new Ajv({allErrors: true, loadSchema: Schema.lesSchemaDefinitonsAsync});
  const validate = await ajv.compileAsync(schema);
  const valid = validate(data);

  if (valid) {
    console.log(emoji.get('white_check_mark'), `[POST] ${label}`);
  }
  else {
    console.dir(validate.errors);
    const errmsgs = humanReadableErrors(validate.errors);
    console.log(emoji.get('x'),`${label}`, colors.bgRed(`Invalid post.body:`));
    errmsgs.forEach((msg) => {console.log(' ',msg)});
  }
  return valid;
};
