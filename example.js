'use strict'

const pump = require('pump')
const csvParser = require('csv-parser')

const toGtfsRt = require('.')

const onError = (err) => {
	console.error(err)
	process.exitCode = 1
}

pump(
	process.stdin,
	csvParser({separator: ';'}),
	toGtfsRt(),
	process.stdout,
	onError
)
