/**
**************************************************************************************** API REST ****************************************************************************************************
*/

var Course = require('../models/courses');

module.exports = function(app) {

/********************************** GET COURSES **************************************/


    // toutes les courses
    app.get('/courses', function(req, res) {
        Course.find(function(err, courses) {
            if (err)
                res.send(err);
            res.json(courses);
        });
    });
        
    // une seule course
    app.get('/courses/:course_id', function(req, res) {
        Course.find({'_id': req.params.course_id}, function(err, course) {
            if (err)
                res.send(err);
            if(!course)
                res.status(404).send('Course inconnue');
            res.json(course);
        });
    });
   
    
/********************************* CREER COURSE *************************************/
    
    // Si une course avec le même nom existe déjà, création impossible
    app.post('/courses', function(req, res) {
       
        Course.findOne({'nom': req.body.nom}, function(err, course) {
            if (err)
                res.send(err);
            if (!course) {
                 
                var newCourse = new Course();

                newCourse.nom = req.body.nom;
                newCourse.lieu = req.body.lieu;
                newCourse.date = req.body.date;
                newCourse.heure = req.body.heure;

                newCourse.save(function(err, course) {
                    if (err)
                        res.send(err);
                    res.json(course);
                });
            }
            else if (course)
                res.status(403).send('Course déjà créée');
        });
        
    });
    
    
/******************************* MODIFIER COURSE ************************************/
    
    app.put('/courses/:course_id', function(req, res) {
        Course.findById(req.params.course_id, function(err, course) {
            if (err)
                res.send(err);
            if (course) {
                 
                if (req.body.nom != null)
                    course.nom = req.body.nom;
                if (req.body.lieu != null)
                    course.lieu = req.body.lieu;
                if (req.body.date != null)
                    course.date = req.body.date;
                if (req.body.heure != null)
                    course.heure = req.body.heure;

                course.save(function(err, course) {
                    if (err)
                        res.send(err);
                    res.json(course);
                });
            }
            else
                res.status(404).send('Course inconnue');
        });
    });
    
    
/********************************* DELETE COURSE ************************************/
    
    // une seule course
    app.delete('/courses/:course_id', function(req, res) {
       Course.remove({
           _id: req.params.course_id
       }, function(err, course) {
           if (err)
               res.send(err);
            if(!course)
                res.status(404).send('Course inconnue');
           else
               res.send('Course supprimée');
       });
    });
    
    //toutes les courses
    app.delete('/courses', function(req, res) {
       Course.remove(function(err) {
           if (err)
               res.send(err);
           res.send('Courses supprimées');
       });
    });


}

