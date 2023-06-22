const mondayTunnel = require('@mondaydotcomorg/tunnel').default;

const MAX_RETRIES = 5;

const createTunnel = async (port, retries = 0) => {
  const tunnel = await mondayTunnel({
    port,
    subdomain: process.env.TUNNEL_SUBDOMAIN,
  });
  const { url } = tunnel;

  const usedSubDomain = url.includes(process.env.TUNNEL_SUBDOMAIN);
  if (!usedSubDomain && retries < MAX_RETRIES) {
    console.warn('could not use requested subdomain, retrying');
    tunnel.close();
    return setTimeout(() => {
      createTunnel(port, ++retries);
    }, 200);
  }

  if (!usedSubDomain) {
    console.warn('could not use requested subdomain, generated a random one');
  }
  console.log(`listening at localhost:${port} || tunnel: ${url}`);
};

module.exports = { createTunnel };
