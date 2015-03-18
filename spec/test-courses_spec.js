/*
************************************* Tests courses **********************************
*/

var frisby = require('frisby');

var URL = 'http://localhost:8080';


/**************************** DELETE ALL OK ******************************/

frisby.create('DELETE all courses')
    .delete(URL + '/courses')
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'text')
    .expectBodyContains('Courses supprimées')
.toss();


/**************************** POST OK ******************************/

frisby.create('POST course Toulouse')
  .post(URL + '/courses', {
    nom: 'Marathon Toulouse',
    lieu: 'Toulouse',
    date: '01/02/2015',
    heure: '8h55'
})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')
  .expectJSONTypes({
    nom: String,
    lieu: String,
    date: String,
    heure: String
  })
  .expectJSON({ 
    nom: 'Marathon Toulouse',
    lieu: 'Toulouse',
    heure: '8h55'
  })
.toss();

frisby.create('POST course La Rochelle')
  .post(URL + '/courses', {
    nom: 'Marathon La Rochelle',
    lieu: 'La Rochelle',
    date: '01/02/2015',
    heure: '9h00'
})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')
  .expectJSONTypes({
    nom: String,
    lieu: String,
    date: String,
    heure: String
  })
  .expectJSON({ 
    nom: 'Marathon La Rochelle',
    lieu: 'La Rochelle',
    heure: '9h00'
  })
.toss();


frisby.create('POST course')
  .post(URL + '/courses', {
    nom: 'Marathon Lune',
    lieu: 'Lune',
    date: '01/01/2001',
    heure: '8h00'
})
  .expectStatus(200)
  .expectHeaderContains('Content-Type', 'json')
  .expectJSONTypes({
    nom: String,
    lieu: String,
    date: String,
    heure: String
  })
  .expectJSON({ 
    nom: 'Marathon Lune',
    lieu: 'Lune',
    heure: '8h00'
  })
  // 'afterJSON' automatically parses response body as JSON and passes it as an argument
  .afterJSON(function(course) {

        /***************************** GET OK *******************************/

        // Use data from previous result in next test
        frisby.create('Get course')
          .get(URL + '/courses/' + course._id)
          .expectStatus(200)
        .expectHeaderContains('Content-Type', 'json')
        .expectJSONTypes('*',{
            nom: String,
            lieu: String,
            date: String,
            heure: String
        })
        .expectJSON('*',{ 
            nom: 'Marathon Lune',
            lieu: 'Lune',
            heure: '8h00' 
          })
        .toss();
      

        /***************************** PUT OK *******************************/

        // Use data from previous result in next test
        frisby.create('PUT course')
          .put(URL + '/courses/' + course._id, {
            lieu: 'Satellite'
        })
          .expectStatus(200)
        .expectHeaderContains('Content-Type', 'json')
        .expectJSONTypes({
            nom: String,
            lieu: String,
            date: String,
            heure: String
        })
        .expectJSON({ 
            nom: 'Marathon Lune',
            lieu: 'Satellite',
            heure: '8h00' 
          })
        .toss();
    
        /***************************** DELETE OK *******************************/

        // Use data from previous result in next test
        frisby.create('DELETE course')
          .delete(URL + '/courses/' + course._id)
          .expectStatus(200)
        .toss();
    
    })
.toss();



/******************************* GET ALL OK *************************************/

frisby.create('Get all courses')
    .get(URL + '/courses')
    .expectStatus(200)
    .expectHeaderContains('Content-Type', 'json')
    .expectJSONTypes('*', {
        nom: String,
        lieu: String,
        date: String,
        heure: String
    })
.toss();



/**************************** POST FAIL ******************************/

// course déja existante
frisby.create('POST fail course Toulouse')
  .post(URL + '/courses', {
    nom: 'Marathon Toulouse',
    lieu: 'Toulouse',
    date: '01/02/2015',
    heure: '8h55'
})
  .expectStatus(403)
  .expectHeaderContains('Content-Type', 'text')
  .expectBodyContains('Course déjà créée')
.toss();


/**************************** GET FAIL ******************************/

// course inexistante
frisby.create('GET fail course ')
  .get(URL + '/courses/lolilol')
  .expectStatus(404)
  .expectHeaderContains('Content-Type', 'json')
  .expectBodyContains('Course inconnue')
.toss();


/**************************** PUT FAIL ******************************/

// course inexistante
frisby.create('PUT fail course ')
  .put(URL + '/courses/lolilol')
  .expectStatus(404)
  .expectHeaderContains('Content-Type', 'json')
  .expectBodyContains('Course inconnue')
.toss();


/**************************** DELETE FAIL ******************************/

// course inexistante
frisby.create('DELETE fail course ')
  .delete(URL + '/courses/lolilol')
  .expectStatus(404)
  .expectHeaderContains('Content-Type', 'json')
  .expectBodyContains('Course inconnue')
.toss();

