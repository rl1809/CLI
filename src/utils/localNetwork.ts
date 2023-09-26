import { networkInterfaces } from "os";
export const getLocalNetworkAddress = () => {
  const interfaces = networkInterfaces();
  let localNetworkAddress: string | undefined;

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (iface.internal || iface.family !== "IPv4") {
        continue;
      }

      // This is your local network IP
      localNetworkAddress = iface.address;
    }
  }

  return localNetworkAddress;
};
