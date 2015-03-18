/************************************** USERS ****************************************/

// module pour mongo
var mongoose = require('mongoose');

// creation du schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    nom: String,
    prenom: String,
    naissance: Date,
    nationalite: String,
    email: String,
    evenementsCrees: [{
        id: String,
        nom: String
    }],
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
});



// exporte le modèle 
module.exports = mongoose.model('User', UserSchema);