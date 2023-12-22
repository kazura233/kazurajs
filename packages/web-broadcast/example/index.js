const server = require('live-server')
const fs = require('fs')

fs.copyFileSync('../umd/web-broadcast.js', './server1/js/web-broadcast.js')
fs.copyFileSync('../umd/web-broadcast.js', './server2/js/web-broadcast.js')

fs.copyFileSync('../iife/web-broadcast-proxy.js', './server1/js/web-broadcast-proxy.js')
fs.copyFileSync('../iife/web-broadcast-proxy.js', './server2/js/web-broadcast-proxy.js')

server.start({
  port: 8181,
  host: '0.0.0.0',
  root: './server1',
  file: 'index.html',
})

server.start({
  port: 8182,
  host: '0.0.0.0',
  root: './server2',
  file: 'index.html',
})
