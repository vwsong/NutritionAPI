var express = require('express'); // call express
var http = require("http");
var bodyParser = require('body-parser');
var Firebase = require("firebase");
var request = require('request');
var myFirebaseRef = new Firebase("https://incandescent-fire-6785.firebaseio.com/");
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var appID = '235a8c0f';
var appKey = 'd4c15742a3e03ec8b11ccb91e287126e';

var port = process.env.PORT || 8080;

var routerDelete = express.Router();
var routerDelete = express.Router();
routerDelete.route('/delete/:user_id').get(function (req, res1) {
    var id = req.params.user_id;
    myFirebaseRef.once("value", function (snapshot) {
        if (snapshot.child(id).exists()) {
            myFirebaseRef.child(id).remove();
            res1.json({
                removed: true
            });
        } else {
            res1.json({
                removed: false
            });
        }
    });

});

var routerInputs = express.Router();
routerInputs.route('/info/:user_id').get(function (req, res1) {
    var id = req.params.user_id;
    myFirebaseRef.once("value", function (snapshot) {
        if (snapshot.child(id).exists()) {
            var addCal = snapshot.child(id + "/calories").val();
            var addTF = snapshot.child(id + "/totalFat").val();
            var addChol = snapshot.child(id + "/cholersterol").val();
            var addFiber = snapshot.child(id + "/fiber").val();
            var addSugar = snapshot.child(id + "/sugar").val();
            var addProtein = snapshot.child(id + "/protein").val();
            var addVA = snapshot.child(id + "/vitaminA").val();
            var addVC = snapshot.child(id + "/vitaminC").val();
            var addC = snapshot.child(id + "/calcium").val();
            var addIron = snapshot.child(id + "/iron").val();
            var foods = snapshot.child(id + "/foods").val();
            res1.json({
                error: 0,
                User: id,
                calories: addCal,
                cholesterol: addChol,
                fiber: addFiber,
                sugar: addSugar,
                protein: addProtein,
                vitaminA: addVA,
                vitaminC: addVC,
                calcium: addC,
                iron: addIron,
                count: foods
            });
        } else {
            res1.json({
                error: 1
            });
        }
    });

});

var router = express.Router();
router.route('/food/:food_id/:user_id')
    .get(function (req, res1) {
        var foodId = 0;
        var id = req.params.user_id;
        request({
            url: 'https://api.nutritionix.com/v1_1/search/+' + req.params.food_id + '?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=' + appID + '&appKey=' + appKey,
            json: true
        }, function (err, res, json1) {
            if (err) {
                res1.json({
                    error: 1
                });
            } else {
                if (json1.total_hits == 0) {
                    res1.json({
                        error: 1
                    });
                } else {
                    foodId = json1.hits[0].fields.item_id;
                    console.log(json1.hits[0].fields.item_id);
                    request({
                        url: 'https://api.nutritionix.com/v1_1/item?id=' + foodId + '&appId=' + appID + '&appKey=' + appKey,
                        json: true
                    }, function (err, res, json2) {
                        var item = json2.item_name;
                        var calories = json2.nf_calories;
                        var fatCalories = json2.nf_calories_from_fat;
                        var totalFat = json2.nf_total_fat;
                        var saturatedFat = json2.nf_saturated_fat;
                        var polyFat = json2.nf_polyunsaturated_fat;
                        var monoFat = json2.nf_monosaturated_fat;
                        var cholesterol = json2.nf_cholesterol;
                        var carbohydrates = json2.nf_total_carbohydrate;
                        var fiber = json2.nf_dietary_fiber;
                        var sugar = json2.nf_sugars;
                        var protein = json2.nf_protein;
                        var vitaminA = json2.nf_vitamin_a_dv;
                        var vitaminC = json2.nf_vitamin_c_dv;
                        var calcium = json2.nf_calcium_dv;
                        var iron = json2.nf_iron_dv;
                        var servingsPerContainer = json2.nf_servings_per_container;
                        var servingSize = json2.nf_serving_size_qty;
                        var sizeUnit = json2.nf_serving_size_unit;

                        myFirebaseRef.once("value", function (snapshot) {
                            if (snapshot.child(id).exists()) {
                                var user = snapshot.val();
                                console.log(snapshot.child(id + "/calories").val());
                                var addCal = snapshot.child(id + "/calories").val();
                                var addTF = snapshot.child(id + "/totalFat").val();
                                var addChol = snapshot.child(id + "/cholersterol").val();
                                var addFiber = snapshot.child(id + "/fiber").val();
                                var addSugar = snapshot.child(id + "/sugar").val();
                                var addProtein = snapshot.child(id + "/protein").val();
                                var addVA = snapshot.child(id + "/vitaminA").val();
                                var addVC = snapshot.child(id + "/vitaminC").val();
                                var addC = snapshot.child(id + "/calcium").val();
                                var addIron = snapshot.child(id + "/iron").val();
                                var foods = snapshot.child(id + "/foods").val();
                                foods++;
                                calories += addCal;
                                totalFat += totalFat;
                                cholesterol += addChol;
                                fiber += addFiber;
                                sugar += addSugar;
                                protein += addProtein;
                                vitaminA += addVA;
                                vitaminC += addVC;
                                calcium += addC;
                                iron += addIron;
                                myFirebaseRef.child(id).set({
                                    error: 0,
                                    foods: foods,
                                    calories: calories,
                                    totalFat: totalFat,
                                    cholersterol: cholesterol,
                                    fiber: fiber,
                                    sugar: sugar,
                                    protein: protein,
                                    vitaminA: vitaminA,
                                    vitaminC: vitaminC,
                                    calcium: calcium,
                                    iron: iron
                                });
                            } else {
                                myFirebaseRef.child(id).set({
                                    error: 0,
                                    foods: 0,
                                    calories: calories,
                                    totalFat: totalFat,
                                    cholersterol: cholesterol,
                                    fiber: fiber,
                                    sugar: sugar,
                                    protein: protein,
                                    vitaminA: vitaminA,
                                    vitaminC: vitaminC,
                                    calcium: calcium,
                                    iron: iron
                                });
                            }
                        });

                        res1.json({
                            error: 0,
                            name: item,
                            calories: calories,
                            fatCalories: fatCalories,
                            totalFat: totalFat,
                            saturatedFat: saturatedFat,
                            polyFat: polyFat,
                            monoFat: monoFat,
                            cholersterol: cholesterol,
                            fiber: fiber,
                            sugar: sugar,
                            protein: protein,
                            vitaminA: vitaminA,
                            vitaminC: vitaminC,
                            calcium: calcium,
                            iron: iron,
                        });
                    });
                }
            }
        });

    });

app.use('/api', router);
app.use('/api', routerInputs);
app.use('/api', routerDelete);

app.listen(port);
console.log('We are at' + port);