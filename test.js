'use strict'

const test = require('tape')
const pump = require('pump')
const fromArr = require('from2-array')
const {Writable} = require('stream')
const Pbf = require('pbf')
const {FeedMessage, VehiclePosition} = require('gtfs-rt-bindings')

const toGtfsRt = require('.')

const sample = [{
	id: '4',
	vehicle_id: 'EZ10_G2-005',
	latitude: '52.4821629317',
	longitude: '13.3572122319',
	theta: '-0.6957088709',
	speed: '0',
	battery: '66',
	doors: 'f',
	last_seen: '2018-02-13 15:25:08+01',
	created_at: '2018-02-13 14:25:08.270963'
}, {
	id: '5',
	vehicle_id: 'EZ10_G2-005',
	latitude: '52.4821629315',
	longitude: '13.3572122382',
	theta: '-0.6960601211',
	speed: '0',
	battery: '66',
	doors: 'f',
	last_seen: '2018-02-13 15:25:08+01',
	created_at: '2018-02-13 14:25:08.733317'
}, {
	id: '6',
	vehicle_id: 'EZ10_G2-005',
	latitude: '52.4821629262',
	longitude: '13.3572122311',
	theta: '-0.6959661841',
	speed: '0',
	battery: '66',
	doors: 'f',
	last_seen: '2018-02-13 15:25:09+01',
	created_at: '2018-02-13 14:25:09.280993'
}, {
	id: '7',
	vehicle_id: 'EZ10_G2-005',
	latitude: '52.4821629306',
	longitude: '13.35721224',
	theta: '-0.6955226064',
	speed: '0',
	battery: '66',
	doors: 'f',
	last_seen: '2018-02-13 15:25:09+01',
	created_at: '2018-02-13 14:25:09.709671'
}, {
	id: '8',
	vehicle_id: 'EZ10_G2-005',
	latitude: '52.4821629221',
	longitude: '13.357212229',
	theta: '-0.6960395575',
	speed: '0',
	battery: '66',
	doors: 'f',
	last_seen: '2018-02-13 15:25:10+01',
	created_at: '2018-02-13 14:25:10.266444'
}]

const is = val => val !== null && val !== undefined
const validStatuses = [
	VehiclePosition.VehicleStopStatus.STOPPED_AT,
	VehiclePosition.VehicleStopStatus.IN_TRANSIT_TO
]

test('works', (t) => {
	t.plan(16 * 5 + 1)

	const write = (msg, _, cb) => {
		const pbf = new Pbf(msg)
		msg = FeedMessage.read(pbf)
		t.ok(msg)

		t.ok(msg.header)
		t.equal(msg.header.gtfs_realtime_version, '2.0')
		t.equal(typeof msg.header.timestamp, 'number')

		t.ok(Array.isArray(msg.entity))
		t.ok(msg.entity.length > 0)
		const e = msg.entity[0]
		t.ok(e)
		t.ok(is(e.id))

		t.ok(e.vehicle)
		t.ok(e.vehicle.position)
		t.equal(typeof e.vehicle.position.latitude, 'number')
		t.equal(typeof e.vehicle.position.longitude, 'number')
		t.equal(typeof e.vehicle.position.bearing, 'number')
		t.equal(typeof e.vehicle.position.speed, 'number')

		t.ok(validStatuses.includes(e.vehicle.current_status))
		t.equal(typeof e.vehicle.timestamp, 'number')

		cb()
	}

	pump(
		fromArr.obj(sample),
		toGtfsRt(),
		new Writable({objectMode: true, write}),
		(err) => {
			t.ifError(err)
			t.end()
		}
	)
})
