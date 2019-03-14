const log4js = require('log4js');
const logger = log4js.getLogger('mock');

const { MOCK_DATA_DIR } = require('../../mock.config');
const ERR = require('../utils/errors');
const Utils = require('../utils/utils');
const Schema = require('../utils/schema-util');
const SchemaPostValidator  = require('../utils/schema-post-validator');

const VILKAR_MOCK_DATA_DIR = `${MOCK_DATA_DIR}/vilkar`;

module.exports.lesVilkarsKatalog = () => {
  return Schema.lesKatalogSync(VILKAR_MOCK_DATA_DIR);
};

const lesVilkar = async (behandlingID) => {
  const mockfile = `${VILKAR_MOCK_DATA_DIR}/vilkar-bid-${behandlingID}.json`;
  return JSON.parse(await Utils.readFileAsync(mockfile));
};

/**
 * Hent vilkar
 * @param req
 * @param res
 * @returns {*}
 */
module.exports.hent = async (req, res) => {
  try {
    const behandlingID = req.params.behandlingID;
    const vilkar = await lesVilkar(behandlingID);
    res.json(vilkar);
  }
  catch (err) {
    console.error(err);
    logger.error(err);
    const melding = ERR.serverError500(req.originalUrl, err);
    res.status(500).send(melding);
  }
};

/**
 * Send vilkar
 * @param req
 * @param res
 * @returns {*}
 */
module.exports.send = async (req, res) => {
  const schema = Schema.lesSchemaFileSync('vilkar-post-schema.json');

  const label = 'Vilkar:send';
  const body = req.body;
  const jsBody = Utils.isJSON(body) ? JSON.parse(body) : body;
  logger.debug(label, JSON.stringify(jsBody));

  const valid = await SchemaPostValidator.testAsync(label, schema, jsBody);
  return valid ? res.json(jsBody) : SchemaPostValidator.valideringFeil(req, res);
};
