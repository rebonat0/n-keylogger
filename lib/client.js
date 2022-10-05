const net = require('net');
const readline = require('readline');

function Client(host, port) {
  this.host = host
  this.port = port
}

Client.prototype.connect = function (cb) {
  const rl = readline.createInterface(
    process.stdin, 
    process.stdout
  );

  const self = this;

  const client = net.connect({
    host: this.host, 
    port: this.port
  }, () => {
    console.log('Connected to %s:%d\n', self.host, self.port);

    rl.on('line', (lineData) => {
      client.write(lineData.trim() + '\n');
    });

    client.on('data', (data) => {
      process.stdin.pause();
      process.stdout.write(data.toString());
      process.stdin.resume();
    });

    client.on('close', () => {
      process.stdin.pause();

      process.stdout.write('\nConnection closed by foreign host.\n');
      rl.close();
    });

    rl.on('SIGINT', () => {
      process.stdin.pause();
      process.stdout.write('\nending session\n');
      rl.close();

      client.end();
    })
    if (cb) cb(client, rl, process.stdin, process.stdout)
  })
}

module.exports = Client;

if (!module.parent) {
  new Client('0.0.0.0', 1337)
      .connect();
}