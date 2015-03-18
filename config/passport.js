/************************************* passport.js *********************************/


var LocalStrategy = require('passport-local').Strategy;

// chargement des modèles 
var User = require('../app/models/users');
var Confidentiel = require('../app/models/confidentiels');

// exporte la fonction
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false);
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.email = email;
                newUser.nom = req.body.nom;
                newUser.prenom = req.body.prenom;
                newUser.naissance = req.body.naissance;
                newUser.nationalite = req.body.nationalite;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
                
                // creation des infos confidentielles
                var newConfidentiel = new Confidentiel();
                newConfidentiel.password = newConfidentiel.generateHash(password);
                newConfidentiel.user_id = newUser._id;
                
                newConfidentiel.save(function(err)  {
                    if (err)
                        throw err;
                    return done(null, user);
                });
                
            }

        });    

        });

    }));
    
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        if (req.user == null) {
            User.findOne({ 'email': email}, function(err, user) {
                  if (err)
                      return done(err);
                  // if no user is found, return the message
                  if (!user) 
                      return done(null, false);

                  Confidentiel.findOne({'user_id' : user._id}, function(err, confidentiel) {
                        // if there are any errors, return the error before anything else
                        if (err)
                            return done(err);

                        if (!confidentiel) 
                          return done(null, false, {message: 'Tres etrange'});

                        // if the user is found but the password is wrong
                        if (!confidentiel.validPassword(password)) 
                            return done(null, false); 

                        // all is well, return successful user
                        return done(null, user);
                    });

            });
        }
        else
            return done(null, false);
        

    }));

};

