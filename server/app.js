const config = require('./config');
const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const io = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
mongoose.connect(config.mongo, function (error) {
  if (error) {
    console.log(error);
  }
});

logger.log('info', 'Start server application');

const Schema = mongoose.Schema;
const PointSchema = new Schema({
  id: String,
  lng: Number,
  lat: Number,
  modified: {type: Date, default: Date.now}
});
const Point = mongoose.model('points', PointSchema);

const MarkerSchema = new Schema({
  id: String,
  lng: Number,
  lat: Number,
  color: String,
  name: String
});
const Marker = mongoose.model('markers', MarkerSchema);

const LineSchema = new Schema({
  id: String,
  color: String,
  coordinates: Object,
  name: String
});
const Line = mongoose.model('line', LineSchema);


// Create server for http messages from devices
const http_devices_app = express();
http_devices_app.use(bodyParser.json());
http_devices_app.post('/set', function (request, response) {
  const data = {
    modified: new Date(),
    lat: request.body.latitude || request.body.lat,
    lng: request.body.longitude || request.body.lon,
    id: request.body.username || request.body.deviceid && request.body.deviceid.slice(-6, -1)
  };
  logger.log('debug', 'http_devices_app query = %s', JSON.stringify(request.body));
  logger.log('debug', 'http_devices_app data = %s', JSON.stringify(data));

  if ((data.lat) && (data.lng) && (data.id)) {
    Point.findOne({id: data.id}, function (err, doc) {
      if (doc) {
        doc.lat = data.lat;
        doc.lng = data.lng;
        doc.modified = data.modified;
        doc.save();
      } else {
        const point = new Point(data);
        point.save();
      }
    });
    browserServer.emit('set:point', data);
    response.json({ error: false, status: 'ok' });
  } else {
    response.json({ error: true, status: 'wrong data, must have "lat", "lon", and "username" set' });
  }
}).listen(config.restPort);

const app = http.createServer();
app.listen(config.browserPort);

const getModel = function (modelName) {
  if (modelName === 'marker') {
    return Marker;
  }
  if (modelName === 'line') {
    return  Line;
  }
  if (modelName === 'point') {
    return  Point;
  }
};

const getAddFunction = function (modelName, socket) {
  const Model = getModel(modelName);

  return function (data) {
    const objectId = data.id;
    if (!objectId) {
      return
    }
    Model.findOne({id: objectId}, function (err, object) {
      if (object) {
        object.updateUpdate(data);
        object.save()
      } else {
        object = new Model(data);
        object.save();
      }
      socket.broadcast.emit('add:' + modelName, object);
    });
  }
};

const getUpdateFunction = function (modelName, socket) {
  const Model = getModel(modelName);
  return function (data) {
    const objectId = data.id;
    if (data._id) {
      delete data._id;
    }
    Model.updateOne({id: objectId}, data, {}, function (err, docs) {
    });
    socket.broadcast.emit('update:' + modelName, data);
  }
};

const getDeleteFunction = function (modelName, socket) {
  const Model = getModel(modelName);
  return function (data) {
    const objectId = data.id;
    if (data._id) {
      delete data._id;
    }
    Model.deleteOne({id: objectId}, function () {
    });
    socket.broadcast.emit('delete:' + modelName, objectId);
  }
};

const getHighlightFunction = function (modelName, socket) {
  return function (objectId) {
    socket.broadcast.emit('highlight:' + modelName, objectId);
  }
};

setInterval(function () {
  var old_date = new Date(new Date() - config.pointTTL);
  Point.deleteOne({modified: {$not: {$gt: old_date}}}, function (err, docs) {
  });
}, config.pointCheckTime);


//Create server for browser
const browserServer = io(app, {
  logger: logger
});


browserServer.on('connection', function (socket) {
  socket.on('add:marker', getAddFunction('marker', socket));
  socket.on('add:line', getAddFunction('line', socket));

  socket.on('update:marker', getUpdateFunction('marker', socket));
  socket.on('update:line', getUpdateFunction('line', socket));

  socket.on('delete:marker', getDeleteFunction('marker', socket));
  socket.on('delete:line', getDeleteFunction('line', socket));

  socket.on('highlight:marker', getHighlightFunction('marker', socket));
  socket.on('highlight:line', getHighlightFunction('line', socket));

  Point.find({}, function (err, points) {
    socket.emit('set:points', points);
  });

  Marker.find({}, function (err, markers) {
    socket.emit('set:markers', markers);
  });

  Line.find({}, function (err, lines) {
    socket.emit('set:lines', lines);
  });
});

setInterval(function () {
  Point.find({}, function (err, points) {
    browserServer.emit('set:points', points);
  });
}, config.pointCheckTime);
