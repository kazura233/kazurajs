(function () {
'use strict';

var MESSAGE_TAG = 'application/x-web-broadcast-proxy-v1';
var broadcastPool = new Map();
var eventHandler = function eventHandler(event) {
  var data = event.data;
  if (typeof data === 'object' && 'tag' in data && data.tag === MESSAGE_TAG) {
    var channelName = data.channelName,
      message = data.data;
    var broadcast = broadcastPool.get(channelName);
    if (!broadcast) {
      broadcast = new BroadcastChannel(channelName);
      broadcastPool.set(channelName, broadcast);
    }
    broadcast.postMessage(message);
  }
};
window.addEventListener('message', eventHandler);

})();
