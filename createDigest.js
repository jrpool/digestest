/*
  index.js
  Digestest main script.
*/

// ########## IMPORTS

// Module to access files.
const fs = require('fs').promises;

// ########## CONSTANTS

const reportID = process.argv[2];

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
    const {parameters} = require(`./digesters/${scriptID}`);
    parameters(report, query);
    const template = await fs.readFile(`digesters/${scriptID}.html`, 'utf8');
    const digest = replaceHolders(template, query);
    await fs.writeFile(`digests/${reportID}.html`, digest);
  }
  else {
    console.log('ERROR: No report specified');
  }
};

// ########## OPERATION

createDigest(reportID);
