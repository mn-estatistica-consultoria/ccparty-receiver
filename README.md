Chromecast Party receiver
------------------------
Chromecast Party is a little demo that was written for the DutchAUG Chromecast meetup. It consists of two parts, a
custom Google Cast receiver (this code) and an Android sender app.

The receiver app uses AngularJS as a wrapper around the Google Cast receiver API.

Building
--------
To build this app, you need `bower`, `npm` and `grunt-cli` installed. The `npm` tool comes with nodejs, so you need that too.

To setup the project:

```
npm install -g bower grunt-cli
bower install
npm install
grunt build
```

Then upload the contents of the `dist` directory somewhere to serve as the receiver.
