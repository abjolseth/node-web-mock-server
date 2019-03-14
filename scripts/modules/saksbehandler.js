const log4js = require('log4js');
const logger = log4js.getLogger('mock');
const _ = require('lodash');

const { MOCK_DATA_DIR } = require('../../mock.config');
const Utils = require('../utils/utils');
const Schema = require('../utils/schema-util');
const ERR = require('../utils/errors');
const MOCK_DATA_SAKSBEHANDLER_DIR = `${MOCK_DATA_DIR}/saksbehandler`;

module.exports.lesSaksbehandlerKatalog = () => {
  return Schema.lesKatalogSync(MOCK_DATA_SAKSBEHANDLER_DIR);
};
const lesSaksbehandlere = async () => {
  const mockfile = `${MOCK_DATA_DIR}/saksbehandler.json`;
  return await Utils.existsAsync(mockfile) ? JSON.parse(await Utils.readFileAsync(mockfile)) : {};
};

module.exports.hent = async (req, res) => {
  try {
    const saksbehandlere = await lesSaksbehandlere();
    res.json(_.sample(saksbehandlere));
  } catch (err) {
    console.log(err);
    const melding = ERR.serverError500(req.originalUrl, err);
    logger.error(melding);
    res.status(500).send(melding);
  }
};

