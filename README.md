# digestest
Produces HTML human-readable digests and comparative reports from Testilo JSON reports

## Introduction

[Testilo](https://www.npmjs.com/package/testilo) uses [Testaro](https://www.npmjs.com/package/testaro) to perform accessibility tests on web pages and produces reports of the results.

This package, Digestest, creates HTML digests of those reports.

The reports are JSON files systematically describing the results, designed for automated processing.

Digests are human-oriented report summaries, with the reports themselves appended.

## Usage

To use Digestest, move or copy a report into the `reports` directory. Then execute the statement `node createDigest xyz`, where `xyz` is replaced with the base of the name of the report file (the name without the `.json` extension).
