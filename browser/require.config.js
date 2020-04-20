require.config({
  paths: {
    'backbone': 'node_modules/backbone/backbone',
    'backbone.wreqr': 'node_modules/backbone.wreqr/lib/backbone.wreqr',
    'backbone.modelbinder': 'node_modules/backbone.modelbinder/Backbone.ModelBinder',
    'backbone.radio': 'node_modules/backbone.radio/build/backbone.radio',
    'jquery': 'node_modules/jquery/dist/jquery',
    'jquery-simple-color': 'node_modules/jquery-simple-color/src/jquery.simple-color',
    'hbs': 'node_modules/require-handlebars-plugin/hbs',
    'hbs/handlebars': 'node_modules/require-handlebars-plugin/hbs/handlebars',
    'backbone.marionette': 'node_modules/backbone.marionette/lib/backbone.marionette',
    'json': 'node_modules/requirejs-json/json',
    'text': 'node_modules/requirejs-text/text',
    'underscore': 'node_modules/underscore/underscore',
    'socket.io-client': 'node_modules/socket.io-client/socket.io'
  },
  hbs: {
    disableI18n: true
  },
  shim: {
    'jquery-simple-color': {
      deps: ['jquery'],
      exports: '$.fn.simpleColor'
    },
    'underscore': {
      exports: '_'
    },
  }
});
