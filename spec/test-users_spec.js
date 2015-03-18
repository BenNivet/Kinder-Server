/*
********************* Tests utilisateurs et authentification ********************
*/

/*
* TODO: tester logout
*/


var frisby = require('frisby');

var URL = 'http://localhost:8080';

var bcrypt = require('bcrypt-nodejs');


/**************************** DELETE ALL OK ******************************/

frisby.create('DELETE all users')
    .delete(URL + '/users')
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'text')
    .expectBodyContains('Utilisateurs supprimés')
.toss();


/**************************** POST/signup OK ******************************/

frisby.create('POST user harry')
  .post(URL + '/signup', {
    nom: 'potter',
    prenom: 'harry',
    email: 'harry@poudlard',
    password: 'gryffondor',
    naissance: '07/31/1992',
    nationalite: 'anglais'
})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')
  .expectJSONTypes({
    nom: String,
    prenom: String,
    email: String,
    naissance: String,
    nationalite: String,
    evenementsCrees: [String],
    historique: [{
        event_id: String,
        dossard: String,
        temps: String,
        vitesseMoyenne: String,
        temps_inter: {
            trente_km: String,
            semi: String,
            dix_km: String
        }
    }]
  })
  .expectJSON({ 
    nom: 'potter',
    prenom: 'harry',
    email: 'harry@poudlard',
    nationalite: 'anglais'
  })
.toss();


frisby.create('POST user ron')
  .post(URL + '/signup', {
    nom: 'weasley',
    prenom: 'ron',
    email: 'ron@poudlard',
    password: 'gryffondor',
    naissance: '02/18/1992',
    nationalite: 'anglais'
})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')
  .expectJSONTypes({
    nom: String,
    prenom: String,
    email: String,
    naissance: String,
    nationalite: String,
    evenementsCrees: [String],
    historique: [{
        event_id: String,
        dossard: String,
        temps: String,
        vitesseMoyenne: String,
        temps_inter: {
            trente_km: String,
            semi: String,
            dix_km: String
        }
    }]
  })
  .expectJSON({ 
    nom: 'weasley',
    prenom: 'ron',
    email: 'ron@poudlard',
    nationalite: 'anglais'
  })
.toss();


frisby.create('POST user hermione')
  .post(URL + '/signup', {
    nom: 'granger',
    prenom: 'hermione',
    email: 'hermione@poudlard',
    password: 'gryffondor',
    naissance: '11/04/1992',
    nationalite: 'anglaise'
})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')
  .expectJSONTypes({
    nom: String,
    prenom: String,
    email: String,
    naissance: String,
    nationalite: String,
    evenementsCrees: [String],
    historique: [{
        event_id: String,
        dossard: String,
        temps: String,
        vitesseMoyenne: String,
        temps_inter: {
            trente_km: String,
            semi: String,
            dix_km: String
        }
    }]
  })
  .expectJSON({ 
    nom: 'granger',
    prenom: 'hermione',
    email: 'hermione@poudlard',
    nationalite: 'anglaise'
  })
  // 'afterJSON' automatically parses response body as JSON and passes it as an argument
  .afterJSON(function(user) {

        /***************************** GET user OK *******************************/

        // Use data from previous result in next test
        frisby.create('Get user')
          .get(URL + '/users/' + user._id)
          .expectStatus(200)
          .expectHeaderContains('Content-Type', 'json')
          .expectJSONTypes('*',{
            nom: String,
            prenom: String,
            email: String,
            naissance: String,
            nationalite: String,
            evenementsCrees: [String],
            historique: [{
                event_id: String,
                dossard: String,
                temps: String,
                vitesseMoyenne: String,
                temps_inter: {
                    trente_km: String,
                    semi: String,
                    dix_km: String
                }
            }]
        })
        .expectJSON('*',{ 
            nom: 'granger',
            prenom: 'hermione',
            email: 'hermione@poudlard',
            nationalite: 'anglaise' 
          })
        .toss();
    
        /*************************** GET confidentiel OK *****************************/

            
            // Use data from previous result in next test
            frisby.create('Get confidentiel')
          .get(URL + '/users/conf/' + user._id)
          .expectStatus(200)
          .expectHeaderContains('Content-Type', 'json')
          .expectJSONTypes({
                user_id: String,
                password: String,
                course: [{
                    event_id: String,
                    rythme_card: Number,
                    rythme_card_moyen: Number,
                    calories: Number
                }],
                parametres: [{
                    poids: Boolean,
                    taille: Boolean,
                    musculature: Boolean,
                    VMA: Boolean,
                    rythme_card: Boolean,
                    calories: Boolean
                }]
            })
            .expectJSON({ 
                user_id: user._id
              })
            .afterJSON(function(confidentiel) {
                expect(bcrypt.compareSync('gryffondor', confidentiel.password)).toEqual(true);
            })
            .toss();    
        
      

        /***************************** PUT user OK *******************************/

        // Use data from previous result in next test
        frisby.create('PUT user')
          .put(URL + '/users/' + user._id, {
            prenom: 'hermy'
        })
          .expectStatus(200)
        .expectHeaderContains('Content-Type', 'json')
        .expectJSONTypes({
            nom: String,
            prenom: String,
            email: String,
            naissance: String,
            nationalite: String,
            evenementsCrees: [String],
            historique: [{
                event_id: String,
                dossard: String,
                temps: String,
                vitesseMoyenne: String,
                temps_inter: {
                    trente_km: String,
                    semi: String,
                    dix_km: String
                }
            }]
        })
        .expectJSON({ 
            nom: 'granger',
            prenom: 'hermy',
            email: 'hermione@poudlard',
            nationalite: 'anglaise' 
          })
        .toss();
    
        /*************************** PUT confidentiel OK ****************************/

    
            // Use data from previous result in next test
            frisby.create('PUT confidentiel')
              .put(URL + '/users/conf/' + user._id, {
                poids: 50
            })
              .expectStatus(200)
            .expectHeaderContains('Content-Type', 'json')
            .expectJSONTypes({
                user_id: String,
                password: String,
                poids: Number,
                course: [{
                    event_id: String,
                    rythme_card: Number,
                    rythme_card_moyen: Number,
                    calories: Number
                }],
                parametres: [{
                    poids: Boolean,
                    taille: Boolean,
                    musculature: Boolean,
                    VMA: Boolean,
                    rythme_card: Boolean,
                    calories: Boolean
                }]
            })
            .expectJSON({ 
                user_id: user._id,
                poids: 50
              })
            .afterJSON(function(confidentiel) {
                expect(bcrypt.compareSync('gryffondor', confidentiel.password)).toEqual(true);
            })
            .toss();
    
        /***************************** DELETE OK *******************************/

        // Use data from previous result in next test
        frisby.create('DELETE user')
          .delete(URL + '/users/' + user._id)
          .expectStatus(200)
          .expectHeaderContains('Content-Type', 'text')
          .expectBodyContains('Utilisateur supprimé')
        .toss();
    
    })
.toss();



/******************************* GET ALL OK *************************************/

frisby.create('Get all users')
    .get(URL + '/users')
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'json')
    .expectJSONTypes('*', {
        nom: String,
            prenom: String,
            email: String,
            naissance: String,
            nationalite: String,
            evenementsCrees: [String],
            historique: [{
                event_id: String,
                dossard: String,
                temps: String,
                vitesseMoyenne: String,
                temps_inter: {
                    trente_km: String,
                    semi: String,
                    dix_km: String
                }
            }]
    })
.toss();



/**************************** POST FAIL ******************************/

// email déjà pris
frisby.create('POST fail user')
  .post(URL + '/signup', {
    email: 'harry@poudlard',
    password: 'gryffondor'
})
  .expectStatus(401)
.toss();

// pas d'email
frisby.create('POST fail user')
  .post(URL + '/signup', {
    password: 'gryffondor'
})
  .expectStatus(401)
.toss();

// pas de password
frisby.create('POST fail user')
  .post(URL + '/signup', {
    email: 'neville@poudlard'
})
  .expectStatus(401)
.toss();


/**************************** GET user FAIL ******************************/

// utilisateur inexistant
frisby.create('GET fail user ')
  .get(URL + '/users/lolilol')
  .expectStatus(404)
  .expectHeaderContains('Content-Type', 'json')
  .expectBodyContains('Utilisateur inconnu')
.toss();


/**************************** GET confidentiel FAIL ******************************/

// utilisateur inexistant
frisby.create('GET fail confidentiel ')
  .get(URL + '/users/conf/lolilol')
  .expectStatus(404)
.toss();


/**************************** PUT user FAIL ******************************/

// utilisateur inexistant
frisby.create('PUT fail user ')
  .put(URL + '/users/lolilol')
  .expectStatus(404)
  .expectHeaderContains('Content-Type', 'json')
  .expectBodyContains('Utilisateur inconnu')
.toss();


/**************************** PUT confidentiel FAIL ******************************/

// utilisateur inexistant
frisby.create('PUT fail confidentiel ')
  .put(URL + '/users/conf/lolilol')
  .expectStatus(404)
  .expectHeaderContains('Content-Type', 'text')
  .expectBodyContains('Utilisateur inconnu')
.toss();


/**************************** DELETE FAIL ******************************/

// utilisateur inexistant
frisby.create('DELETE fail user ')
  .delete(URL + '/users/lolilol')
  .expectStatus(404)
  .expectHeaderContains('Content-Type', 'json')
  .expectBodyContains('Utilisateur inconnu')
.toss();



/*********************************** LOGIN OK ***************************************/

frisby.create('POST login ok')
.post(URL+'/login', {
    email: 'harry@poudlard',
    password: 'gryffondor'
})
.expectStatus(200)
.expectHeaderContains('Content-Type', 'json')
  .expectJSONTypes({
    nom: String,
    prenom: String,
    email: String,
    naissance: String,
    nationalite: String,
    evenementsCrees: [String],
    historique: [{
        event_id: String,
        dossard: String,
        temps: String,
        vitesseMoyenne: String,
        temps_inter: {
            trente_km: String,
            semi: String,
            dix_km: String
        }
    }]
  })
  .expectJSON({ 
    nom: 'potter',
    prenom: 'harry',
    email: 'harry@poudlard',
    nationalite: 'anglais'
  })
.toss();


/********************************** LOGIN FAIL **************************************/

// utilisateur inexistant
frisby.create('POST login fail')
.post(URL+'/login', {
    email: 'neville@poudlard',
    password: 'gryffondor'
})
.expectStatus(401)
.toss();

// mauvais mot de passe
frisby.create('POST login fail')
.post(URL+'/login', {
    email: 'harry@poudlard',
    password: 'serpentard'
})
.expectStatus(401)
.toss();

// pas de mot de passe
frisby.create('POST login fail')
.post(URL+'/login', {
    email: 'harry@poudlard'
})
.expectStatus(401)
.toss();



