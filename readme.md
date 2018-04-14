# bvg-shuttle-gtfs-rt-feed

**Transform the [live positions of the BVG autonomous shuttle](https://cloud.innoz.de/index.php/s/BE8EJsFpImUtq1q) into a [GTFS-Realtime vehicle positions feed](https://developers.google.com/transit/gtfs-realtime/guides/vehicle-positions).**

[![npm version](https://img.shields.io/npm/v/bvg-shuttle-gtfs-rt-feed.svg)](https://www.npmjs.com/package/bvg-shuttle-gtfs-rt-feed)
[![build status](https://api.travis-ci.org/derhuerst/bvg-shuttle-gtfs-rt-feed.svg?branch=master)](https://travis-ci.org/derhuerst/bvg-shuttle-gtfs-rt-feed)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/bvg-shuttle-gtfs-rt-feed.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install bvg-shuttle-gtfs-rt-feed
```


## Usage

```js
const fs = require('fs')
const csvParser = require('csv-parser')
const toGtfsRt = require('bvg-shuttle-gtfs-rt-feed')

const convert = toGtfsRt()

fs.createReadStream('vehicle_states.csv')
.pipe(csvParser())
.pipe(convert)
.pipe(…)
```

`convert` ist a [transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform) that emits [Protobuffer](https://developers.google.com/protocol-buffers/) [GTFS-Realtime `VehiclePosition` updates](https://developers.google.com/transit/gtfs-realtime/guides/vehicle-positions).

---

Download the data from https://hackathon.innoz.de/data and extract it. In the future, this library will fetch liva data from a server.

```js
cat vehicle_states.csv | node example.js >positions.pbf
```


## Contributing

If you have a question or have difficulties using `bvg-shuttle-gtfs-rt-feed`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/bvg-shuttle-gtfs-rt-feed/issues).
