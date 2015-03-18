/**
**************************************************************************************** API REST ****************************************************************************************************
*/

var User = require('../models/users');
var Confidentiel = require('../models/confidentiels');

module.exports = function(app, passport) {

/************************************** LOGIN **************************************/

    app.post('/login', passport.authenticate('login'), 
             function(req, res) {
                res.json(req.user);
    });

    
/************************************ LOGOUT ****************************************/
    
    app.get('/logout',isLoggedIn, function(req, res) {
        console.log(req.user);
        req.logOut();
        res.end();
    });
    

/************************************* SIGNUP ***************************************/

    // création d'un compte
    app.post('/signup', passport.authenticate('signup'),
            function(req, res) {
                res.json(req.user);
    });


/********************************** GET USERS **************************************/


    // tous les utilisateurs
    app.get('/users', function(req, res) {
        console.log(req.user);
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });
        
    // un seul utilisateur
    app.get('/users/:user_id', function(req, res) {
        User.find({'_id': req.params.user_id}, function(err, user) {
            if (err)
                res.send(err);
            if(!user) 
                res.status(404).send('Utilisateur inconnu');
            res.json(user);
        });
    });
    
    // les données confidentielles d'un utilisateur
    app.get('/users/conf/:user_id', function(req, res) {
        Confidentiel.findOne({'user_id': req.params.user_id}, function(err, confidentiel) {
            if (err)
                res.send(err);
            if(!confidentiel) 
                res.status(404).send('Utilisateur inconnu');
            res.json(confidentiel);
        });
    });
    
    
/******************************* MODIFIER USER ************************************/
    
    app.put('/users/:user_id', function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            if (user) {
                 
                if (req.body.nom != null)
                    user.nom = req.body.nom;
                if (req.body.prenom != null)
                    user.prenom = req.body.prenom;
                if (req.body.naissance != null)
                    user.naissance = req.body.naissance;
                if (req.body.nationalite != null)
                    user.nationalite = req.body.nationalite;

                user.save(function(err, user) {
                    if (err)
                        res.send(err);
                    res.json(user);
                });
            }
            else 
                res.status(404).send('Utilisateur inconnu');
        });
    });
    
    // données confidentielles
    app.put('/users/conf/:user_id', function(req, res) {
        Confidentiel.findOne({'user_id': req.params.user_id}, function(err, confidentiel) {
            if (err)
                res.send(err);
            if (confidentiel) {
                 
                if (req.body.password != null)
                    confidentiel.password = req.body.password;
                if (req.body.poids != null)
                    confidentiel.poids = req.body.poids;
                if (req.body.taille != null)
                    confidentiel.taille = req.body.taille;
                if (req.body.musculature != null)
                    confidentiel.musculature = req.body.musculature;
                if (req.body.VMA != null)
                    confidentiel.VMA = req.body.VMA;

                confidentiel.save(function(err, confidentiel) {
                    if (err)
                        res.send(err);
                    res.json(confidentiel);
                });
            }
            else 
                res.status(404).send('Utilisateur inconnu');
        });
    });
    
    
/********************************* DELETE USER **************************************/
    
    // un utilisateur
    app.delete('/users/:user_id', function(req, res) {
       User.remove({_id: req.params.user_id}, function(err, user) {
           if (err)
               res.send(err);
            if(!user)
                res.status(404).send('Utilisateur inconnu');
            else{
                Confidentiel.remove({user_id: req.params.user_id}, function(err, confidentiel) {
                   if (err)
                       res.send(err);
                    if(!confidentiel)
                        res.status(404).send('Utilisateur inconnu');
                    res.send("Utilisateur supprimé");
                 }); 
            } 
        
        });
    });
        
    // tous les utilisateurs
    app.delete('/users', function(req, res) {
       User.remove(function(err) {
           if (err)
               res.send(err);
       });
        Confidentiel.remove(function(err) {
           if (err)
               res.send(err);
        });
        res.send('Utilisateurs supprimés');
    });
    
}



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
