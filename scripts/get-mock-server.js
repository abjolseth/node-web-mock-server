const colors = require('colors/safe');
const axios = require("axios");
axios.defaults.headers.get['Content-Type'] = 'application/json';

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
    await instance.get('/saksbehandler').then(printresult).catch(printerror);
    await instance.get('/vilkaar/4').then(printresult).catch(printerror);
  }
  catch (e) {
    console.log(e);
  }
  console.log('[GET]',colors.green('yarn get-mock'));
  console.dir(oppsummering);
};


console.log('\n=======================================================');
console.log('[GET] Mock server');
console.log("-------------------------------------------------------");
testAlleEndepunkter();
