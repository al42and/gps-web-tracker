GPS web-tracker for many devices
================================

* Simple.
* Based on socket.io and Yandex maps.
* No database, no jquery. Js script minified and gzipped is only 16 Kb.
* Server accepts json messages through tcp like `{id:1, lat:10, lng:20}`.
For devices to send these messages you can use translator server.

Installation
------------

* Clone repository to your server.
* `cp browser/config.example.js browser/config.js`; paste your [Yandex.Maps API key](https://tech.yandex.com/maps/jsapi/) there and adjust `serverUrl` and `browserPort`. For local development, set them to `http://localhost` and `8020`.
* `cp server/config.example.js server/config.js`; *don't* edit it.
* `docker-compose build && docker-compose up`.
* Open http://localhost:8020 in your browser and rejoice.

How does it work
----------------

```
                   {id:1,lat:20,lng:30}                          {id:1,lat:20,lng:30}
Translator server ---------------------> GPS web-tracker server ---------------------> Browser
                      JSON over TCP                                    socket.io
```

What is translator server?
--------------------------

Cause each tracker device has its unique protocol to send gps information, there should be a translator server to decode
messages from devices and send it in JSON format. The project is hosted here: http://github.com/vinograd19/gps-devices/
