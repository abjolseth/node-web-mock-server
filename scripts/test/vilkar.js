const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const Schema = require('../utils/schema-util');
const Vilkarer = require('../modules/vilkar');

const schema = Schema.lesSchemaFileSync('vilkar-schema.json');
const katalog = Vilkarer.lesVilkarsKatalog();

const validate = ajv.compile(schema);


const testAll = () => {
  Schema.prettyTittel('Vilkar');
  katalog.forEach((elem) => Schema.runTest(elem, ajv, validate));
};

const testOne = (path) => {
  const tittel = Schema.katalogTittel(path);
  Schema.prettyTittel(tittel);
  const elem = Schema.lesKatalogElement(path);
  return Schema.runTest(elem, ajv, validate);
};

const vilkar = {
  testAll,
  testOne,
};
module.exports.vilkar = vilkar;

