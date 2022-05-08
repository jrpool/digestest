/*
  index.js
  Digestest main script.
*/

// ########## IMPORTS

// Module to access files.
const fs = require('fs').promises;

// ########## CONSTANTS

// ########## FUNCTIONS

// Replaces the placeholders in content with eponymous query parameters.
const replaceHolders = (content, query) => content
.replace(/__([a-zA-Z]+)__/g, (ph, qp) => query[qp]);
// Validates a report and returns success or a reason for failure.
const reportOK = async reportJSON => {
  try {
    const report = JSON.parse(reportJSON);
    const {id, tester} = report;
    if (! tester) {
      return ['error', 'noTester'];
    }
    else if (! id) {
      return ['error', 'noID'];
    }
    else if (! /^[a-z0-9]+$/.test(id)) {
      return ['error', 'invalidID'];
    }
    else {
      return ['id', id];
    }
  }
  catch(error) {
    return ['error', 'badJSON'];
  }
};
// Creates a digest from a report.
const createDigest = async reportID => {
  // If a report was specified:
  if (reportID) {
    // Create the digest.
    const reportJSON = await fs.readFile(`reports/${reportID}.json`, 'utf8');
    const report = JSON.parse(reportJSON);
    const query = {};
    const scriptID = report.script.id;
    const {parameters} = require(`digesters/${scriptID}`);
    parameters(report, query);
    const template = await fs.readFile(`digesters/${scriptID}.html`, 'utf8');
    const digest = replaceHolders(template, query);
    await fs.writeFile(`digests/${reportID}.html`, digest);
  }
  else {
    console.log('ERROR: No report specified');
  }
};

// ########## SERVER

  // Environment variables are defined in Dockerfile or .env.js.
  const serverOptions = {};
if (['http2', 'https'].includes(protocolName)) {
  serverOptions.key = readFileSync(process.env.KEY, 'utf8');
  serverOptions.cert = readFileSync(process.env.CERT, 'utf8');
  serverOptions.allowHTTP1 = true;
}
const creator = protocolName === 'http2' ? 'createSecureServer' : 'createServer';
const server = protocolServer[creator](serverOptions, requestHandler);
// Listens for requests.
const serve = async () => {
  /*
  // Delete the README.md files of the data subdirectories. They exist to force directory tracking.
  for (const subdir of ['batches', 'digests', 'jobs', 'orders', 'reports', 'scripts', 'users']) {
    await fs.unlink(`data/${subdir}/README.md`, {force: true});
  };
  */
    /*
  // Create the data directory and its subdirectories, insofar as they are missing.
  for (const subdir of ['batches', 'digests', 'jobs', 'orders', 'reports', 'scripts', 'users']) {
    try {
      await fs.mkdir(`data/${subdir}`);
    }
    catch(error) {
      console.log(`Did not create data/${subdir}: ${error.message}`);
    }
  }
  */
  const port = process.env.HOSTPORT || '3005';
  server.listen(port, () => {
    console.log(
      `Server listening at ${protocolName}://${process.env.HOST || 'localhost'}:${port}/aorta.`
    );
  });
};
// Start the server.
serve();

// ########## PLATFORM

/**
 * @description Gracefully shut down Node and clean up.
 *
 */
 function shutdownNode() {
  console.log('\nShutting down Node.');
  // Perform any cleanup.
  process.exit(0);
}
/**
* @description Handle unhandled exceptions in the code.
* @param err
*/
function handleUncaughtException(err) {

  console.log('Unhandled exception occurred.' , err);
  // Uncomment if DB connection is made
  console.log('Unhandled exception or rejection. Node is shut down.');
  process.exit(1);
}
// Process shutdown and error conditions.
process.on('SIGTERM', shutdownNode);
process.on('SIGINT', shutdownNode);
process.on('uncaughtException', handleUncaughtException);
process.on('unhandledRejection', handleUncaughtException);
