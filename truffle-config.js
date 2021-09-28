module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    genache: {
      host: "localhost",
      port: 7545,
      gas: 5000000,
      network_id: "*",
    },
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: 5777,
    // },
    // test: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: 5777,
    // },
  },
  // compilers: {
  //   solc: {
  //     version: "0.4.25",    // Fetch exact version from solc-bin (default: truffle's version)
  //   }
  // }
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows:
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  // enabled: false,
  // host: "127.0.0.1",
  // adapter: {
  //   name: "sqlite",
  //   settings: {
  //     directory: ".db"
  //   }
  // }
  // }
};