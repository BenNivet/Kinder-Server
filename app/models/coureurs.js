/************************************* COUREURS ****************************************/

// module pour mongo
var mongoose = require('mongoose');

// creation du schema
var Schema = mongoose.Schema;

var CoureurSchema = new Schema({
    user_id: String,
    event_id: String,
    gps: {
        latitude: Double,
        longitude: Double,
    },
    distance: Double,
    vitesse: Double,
    vitesse_moy: Double
});



// exporte le modèle 
module.exports = mongoose.model('Coureur', CoureurSchema);