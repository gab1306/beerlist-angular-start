var express = require('express');
var router = express.Router();
var Beer = require("../models/BeerModel");

//the beer routes go here

module.exports = router;


router.get('', function (req, res, next) {

  Beer.find(function (error, beers) {
    if (error) {
      //console.log(error)
      console.error(error)
      return next(error);
    } else {
      console.log(beers)
      res.json(beers);
    }
  });
});

router.post('', function(req, res, next) {
  console.log('hey i got here and her is the req body')
  console.log(req.body)
  var beer = new Beer(req.body);

  beer.save(function(err, beers) {
    if (err) {
      console.error(err)
      return next(err);
    } else {
      res.json(beers);
    }
  });
});

router.get('/:id', function(req, res, next) {
  Beer.findById(req.params.id, function(error, beer) {
    if (error) {
      console.error(error)
      return next(error);
    } else {
      res.send(beer);
    }
  });
});


router.post('/:id/reviews', function(req, res, next) {
  Beer.findById(req.params.id, function(err, foundBeer) {
    if (err) {
      console.error(err);
      return next(err);
    } else if (!foundBeer) {
      return res.send("Error! No beer found with that ID");
    } else {
      foundBeer.reviews.push(req.body)
      foundBeer.save(function(err, updatedBeer) {
        if (err) {
          return next(err);
        } else {
          res.send(updatedBeer);
        }
      });
    }
  });
});

router.delete('/:beerId/reviews/:reviewId', function (req,res,next) {
    Beer.findById(req.params.beerId, function(err, foundBeer) {
    if (err) {
      return next(err);
    } else if (!foundBeer) {
      return res.send("Error! No beer found with that ID");
    } else {
      var reviewToDelete = foundBeer.reviews.id(req.params.reviewId)
      if (reviewToDelete) {
        reviewToDelete.remove()
        foundBeer.save(function(err, updatedBeer) {
          if (err) {
            return next(err);
          } else {
            res.send(updatedBeer);
          }
        });
      } else {
        return res.send("Error! No review found with that ID");
      }
    }
  });
});

router.delete('/:id', function(req, res, next) {
  console.log("hadas"+req.params.id);
  Beer.remove({ _id: req.params.id }, function(err, beers) {
    if (err) {
      console.error(err)
      // return next(err);
    } else {
      res.json(beers);
    }
  });
});

router.put('/:id', function(req, res, next) {
  Beer.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true}, function(err, beer) {
    if (err) {
      console.error(err)
      return next(err);
    } else {
      res.send(beer);
    }
  });
});

// error handler to catch 404 and forward to main error handler
router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// main error handler
// warning - not for use in production code!
router.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
});
