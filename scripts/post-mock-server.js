const colors = require('colors/safe');
const axios = require("axios");
axios.defaults.headers.post['Content-Type'] = 'application/json';

const instance = axios.create({
  baseURL: 'http://localhost:3002/api',
  timeout: 1000
});

const oppsummering = {
  success: 0,
  failure: 0,
};
const printresult = res => {
  oppsummering.success += 1;
  const { method, url} = res.config;
  console.log(`[${method.toUpperCase()}]`, url);
  console.log(res.status, res.statusText);
  console.log("-------------------------------------------------------\n");
};

const printerror = res => {
  oppsummering.failure += 1;
  const { request, response } = res;

  const { method, path } = request;
  const { status, statusText, data } = response;

  const message = (data && data.message) ? data.message : 'Ukjent validering feil';
  console.error(`[${method.toUpperCase()}]`, path);
  console.error(colors.bgRed(`${status} ${statusText}`));
  console.error(message);
  console.error("-------------------------------------------------------\n");
};

const testAlleEndepunkter = async () => {
  try {
    // Vilkar
    const vilkar_post = require('./mock_data/vilkar/post/vilkar-post');
    await instance.post('/vilkaar/4', vilkar_post).then(printresult).catch(printerror);

    console.log('[POST]',colors.green('yarn post-mock'));
    console.dir(oppsummering);
  }
  catch (e) {
    console.error(e);
  }
};

console.log('\n=======================================================');
console.log('[POST] Mock server');
console.log("---------------------------------------------------------");
testAlleEndepunkter();
/*
PUT vs POST for Creation
In short, favor using POST for resource creation.
Otherwise, use PUT when the client is in charge of deciding which URI (via it's resource name or ID) the new resource will have:
if the client knows what the resulting URI (or resource ID) will be,
use PUT at that URI. Otherwise, use POST when the server or service is in charge of deciding the URI for the newly-created resource.
In other words, when the client doesn't (or shouldn't) know what the resulting URI will be before creation,
use POST to create the new resource.
 */
