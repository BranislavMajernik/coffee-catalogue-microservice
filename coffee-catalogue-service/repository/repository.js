//  repository.js
//
//  Exposes a single function - 'connect', which returns
//  a connected repository. Call 'disconnect' on this object when you're done.
'use strict';

var mysql = require('mysql');

//  Class which holds an open connection to a repository
//  and exposes some simple functions for accessing data.
class Repository {
  constructor(connectionSettings) {
    this.connectionSettings = connectionSettings;
    this.connection = mysql.createConnection(this.connectionSettings);
  }

  getCoffees() {
    return new Promise((resolve, reject) => {

      this.connection.query('SELECT name, description, price FROM coffee_catalogue', (err, results) => {
        if(err) {
          this.connection = mysql.createConnection(this.connectionSettings);
          return reject(new Error('An error occured getting the coffees: ' + err));
        }

        resolve((results || []).map((coffee) => {
          return {
            name: coffee.name,
            description: coffee.description,
            price: coffee.price
          };
          console.log("Z databazy: " + coffee.description);
        })).setEncoding('utf8');
      });

    });
  }

  getCoffeeByName(name) {

    return new Promise((resolve, reject) => {

      //  Fetch the customer.
      this.connection.query('SELECT name, description, price FROM coffee_catalogue WHERE name = ?', [name], (err, results) => {

        if(err) {
          return reject(new Error('An error occured getting the coffee: ' + err));
        }

        if(results.length === 0) {
          resolve(undefined);
        } else {
          resolve({
            name: results[0].name,
            description: results[0].description,
            price: results[0].price
          });
        }

      });

    });
  }

  disconnect() {
    this.connection.end();
  }
}

//  One and only exported function, returns a connected repo.
module.exports.connect = (connectionSettings) => {
  return new Promise((resolve, reject) => {
    if(!connectionSettings.host) throw new Error("A host must be specified.");
    if(!connectionSettings.user) throw new Error("A user must be specified.");
    if(!connectionSettings.password) throw new Error("A password must be specified.");
    if(!connectionSettings.port) throw new Error("A port must be specified.");

    resolve(new Repository(connectionSettings));
  });
};
