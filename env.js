angular.module('otcWebApp')
  .constant('ENV', {
    name: 'development',
    apiEndpoint: 'http://localhost:8080/arp-api',
    roleTypes: {
      RW: 'dev-autoreplenish-enduser-rw',
      RO: 'dev-autoreplenish-enduser-ro'
    }
  });
