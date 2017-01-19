module.exports = function(express, app, jwt) {
  var router = express.Router();

  // models
  var User = require('./models/user');

  // --- NO PROTECTED FUNCTIONS
  router.get('/', function(req, res) {
    res.json({ message: 'Welcome to Diables de les Corts API!' });
  });

  router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
      email: req.body.email
    }).select('email password').exec(function(err, user) {
      if (err || !user) {
        return res.json({
          success: false,
          message: 'USER_NOT_FOUND'
        });
      }

      // check if password matches
      if (!user.validPassword(req.body.password)) {
        return res.json({
          success: false,
          message: 'INVALID_PASSWORD'
        });
      }

      // create a token
      jwt.sign(user, app.get('superSecret'), {
        expiresIn: (req.body.extended) ? '1m' : '1d' // expires in 1 month : 24 hours
      }, function(err, token) {
        if (err) {
          return res.json({
            success: false,
            message: 'TOKEN_ERROR'
          });
        }

        user.authToken = token;
        user.save(function(err) {
          if (err) {
            res.json({
              success: false,
              message: 'AUTH_ERROR'
            });
          }

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'AUTH_SUCCESS',
            token: token
          });
        });
      });
    });
  });

  router.post('/users', function(req, res) {
    if (typeof req.body.name === 'undefined' || req.body.name < 3) {
      return res.json({
        success: true,
        message: 'NAME_REQUIRED'
      });
    }
    if (typeof req.body.email === 'undefined' || req.body.email < 5) {
      return res.json({
        success: true,
        message: 'EMAIL_REQUIRED'
      });
    }
    if (typeof req.body.password === 'undefined' || req.body.password < 4) {
      return res.json({
        success: true,
        message: 'PASSWORD_REQUIRED'
      });
    }

    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err || user) {
        return res.json({
          success: false,
          message: 'USER_FOUND'
        });
      }

      var user = new User({
        name: req.body.name,
        email: req.body.email,
        authToken: '',
        admin: false,
        group: req.body.group,
        eatType: req.body.eatType,
        burgerIngredients: req.body.burgerIngredients,
        drink: req.body.drink,
        comments: req.body.comments,
        status: req.body.status
      });
      user.password = user.generateHash(req.body.password);

      user.save(function(err) {
        if (err) {
          return res.json({
            success: false,
            message: 'USER_CREATION_ERROR'
          });
        };

        res.json({
          success: true,
          message: 'USER_CREATED'
        });
      });
    });
  });

  // MiddleWare to validate token
  router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (!token) {
      return res.status(403).send({
          success: false,
          message: 'NO_TOKEN'
      });
    }

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'INVALID_TOKEN'
        });
      }

      User.findOne({
        email: decoded._doc.email
      }).select('+password +authToken').exec(function(err, user) {
        if (err || !user) {
          return res.json({
            success: false,
            message: 'USER_NOT_FOUND'
          });
        }

        if (user.authToken !== token) {
          return res.json({
            success: false,
            message: 'INVALID_TOKEN'
          });
        }

        req.user = user;
        next();
      });
    });
  });

  // --- PROTECTED ROUTES BY TOKEN

  router.get('/users', function(req, res) {
    var filter = {};
    if (!req.user.isAdmin()) {
      filter._id = req.user._id;
    }

    User.find(filter, function(err, users) {
      res.json(users);
    });
  });

  router.get('/users/:userId', function(req, res) {
    if (!req.user.isAdmin() && !req.user._id.equals(req.params.userId)) {
      return res.json({
        success: false,
        message: 'UNAUTHORIZED'
      });
    }

    User.findById(req.params.userId, function(err, user) {
      if (err) {
        return res.json({
          success: false,
          message: 'USER_NOT_FOUND'
        });
      }

      res.json(user);
    });
  });

  router.put('/users/:userId', function(req, res) {
    if (!req.user.isAdmin() && !req.user._id.equals(req.params.userId)) {
      return res.json({
        success: false,
        message: 'UNAUTHORIZED'
      });
    }

    User.findById(req.params.userId, function(err, user) {
      if (err) {
        return res.json({
          success: false,
          message: 'USER_NOT_FOUND'
        });
      }

      if (typeof req.body.name !== 'undefined' || req.body.name < 3) {
        user.name = req.body.name;
      }
      if (typeof req.body.password !== 'undefined' || req.body.password < 4) {
        user.password = user.generateHash(req.body.password);
        user.authToken = '';
      }
      if (typeof req.body.admin !== 'undefined' && user.isAdmin()) { // ADMIN
        user.admin = req.body.admin;
      }
      if (typeof req.body.group !== 'undefined') {
        user.group = req.body.group;
      }
      if (typeof req.body.eatType !== 'undefined') {
        user.eatType = req.body.eatType;
      }
      if (typeof req.body.burgerIngredients !== 'undefined') {
        user.burgerIngredients = req.body.burgerIngredients;
      }
      if (typeof req.body.drink !== 'undefined') {
        user.drink = req.body.drink;
      }
      if (typeof req.body.comments !== 'undefined') {
        user.comments = req.body.comments;
      }
      if (typeof req.body.status !== 'undefined') {
        user.status = req.body.status;
      }

      user.updatedAt = Date.now();

      if (typeof req.body.email !== 'undefined' && req.body.email >= 5) {
        User.findOne({
          email: req.body.email
        }, function(err, checkUser) {
          if (err || checkUser) {
            return res.json({
              success: false,
              message: 'USER_FOUND'
            });
          }

          user.email = req.body.email;
          user.save(function(err) {
            if (err) {
              return res.json({
                success: false,
                message: 'USER_UPDATE_ERROR'
              });
            }

            res.json(user);
          });
        });
      } else {
        user.save(function(err) {
          if (err) {
            return res.json({
              success: false,
              message: 'USER_UPDATE_ERROR'
            });
          }

          res.json(user);
        });
      }
    });
  });

  return router;
};
