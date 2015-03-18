/************************************** CONFIDENTIEL ****************************************/


// module pour mongo
var mongoose = require('mongoose');
//  permet de chiffrer le mot de passe
var bcrypt = require('bcrypt-nodejs');

// creation du schema
var Schema = mongoose.Schema;

var ConfSchema = new Schema({
    user_id: String,
    password: String,
    poids: Number,
    taille: Number,
    musculature: String,
    VMA: String,
    code_message: String,
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
});


/************************* methodes ******************************/

// génère un mot de passe chiffré
ConfSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// vérifie que le mot de passe est valide
ConfSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// exporte le modèle 
module.exports = mongoose.model('Confidentiel', ConfSchema);