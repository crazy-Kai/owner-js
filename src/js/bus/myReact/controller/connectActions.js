'use strict';

define(function (require, exports, module) {
  "use strict";
  //依赖

  var React = require('react'),
      Reflux = require('reflux'),
      ConnectActions = Reflux.createActions({ add: {}, getTarget: {},
    getData: {
      asyncResult: true,
      preEmit: function preEmit() {
        $.ajax({
          url: '../data.json',
          type: 'get',
          dataType: 'json',
          success: function success(data) {
            ConnectActions.getData.completed(data);
          },
          error: function error(data) {
            this.failed;
          }

        });
      }
    }
  });
  module.exports = ConnectActions;
});