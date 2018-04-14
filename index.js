'use strict'

const through = require('through2')
const Pbf = require('pbf')
const {FeedMessage, VehiclePosition} = require('gtfs-rt-bindings')

const transform = (update, _, cb) => {
	const msg = new Pbf()
	FeedMessage.write({ // FeedMessage
		header: {
			gtfs_realtime_version: '2.0',
			timestamp: Date.now() / 1000 | 0
		},
		entity: { // FeedEntity
			id: '1',
			vehicle: { // VehiclePosition
				// todo: trip
				// todo: vehicle
				position: { // Position
					latitude: update.latitude,
					longitude: update.longitude,
					bearing: (update.theta * 180 + 90) / Math.PI,
					speed: update.speed
				},
				// todo: current_stop_sequence, stop_id
				current_status: (update.doors === 't'
					? VehiclePosition.VehicleStopStatus.STOPPED_AT
					: VehiclePosition.VehicleStopStatus.IN_TRANSIT_TO
				),
				timestamp: new Date(update.created_at) / 1000 | 0
			}
		}
	}, msg)

	const buf = msg.finish()
	cb(null, buf)
}

const createStream = () => {
	return through.obj(transform)
}

module.exports = createStream
