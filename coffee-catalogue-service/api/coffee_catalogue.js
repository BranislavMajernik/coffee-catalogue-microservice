// coffee_catalogue.js
//
//  Defines the users api. Add to a server by calling:
//  require('./coffee_catalogue')
'use strict';

//  Only export - adds the API to the app with the given options.
module.exports = (app, options) => {

  app.get('/coffees', (req, res, next) => {
    options.repository.getCoffees().then((coffees) => {
      res.status(200).send(coffees.map((coffee) => { return {
          name: coffee.name,
          description: coffee.description,
          price: coffee.price
        };
      })).setEncoding('utf8');
    })
    .catch(next);
  });

  app.get('/search', (req, res, next) => {

    //  Get the CoffeeByName.
    var name = req.query.name;
    if (!name) {
      throw new Error("When searching for a coffee, the email must be specified, e.g: '/search?name=Cuba Serano'.");
    }

    //  Get the user from the repo.
    options.repository.getCoffeeByName(name).then((coffee) => {

      if(!coffee) {
        res.status(404).send('Coffee not found.');
      } else {
        res.status(200).send({
          name: coffee.name,
          description: coffee.description,
          price: coffee.price
        });
      }
    })
    .catch(next);

  });
};
