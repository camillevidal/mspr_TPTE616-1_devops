var ActiveDirectory = require('activedirectory2');
var config = { url: 'ldap://88.122.55.74:45000',
               baseDN: 'dc=chatelet,dc=com',
               username: 'administrateur@chatelet.com',
               password: 'Dutmenfc123' }
var ad = new ActiveDirectory(config);

var username = 'lucas.gayraud@chatelet.com';
var password = 'chatelet_lg+123';
 
ad.authenticate(username, password, function(err, auth) {
  if (err) {
    console.log('ERROR: '+JSON.stringify(err));
    return;x
  }
 
  if (auth) {
    console.log('Authenticated!');
  }
  else {
    console.log('Authentication failed!');
  }
});