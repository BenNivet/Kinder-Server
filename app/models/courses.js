/************************************** COURSES ****************************************/

// module pour mongo
var mongoose = require('mongoose');

// creation du schema
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    nom: String,
    lieu: String,
    date: String,
    heure: String,
    id_createur: String, // user_id
    participants: [String], // id_participant
    classement: [{
        position: Number,
        id_user: String,
        nom: String,
        prenom: String,
        nationalite: String
    }],
    galerie: [{
        title: String,
        multimedia: String
    }] 
});


/************************* methodes ******************************/


// exporte le modèle 
module.exports = mongoose.model('Course', CourseSchema);