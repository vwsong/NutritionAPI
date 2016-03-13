var express = require('express'); // call express
var http = require("http");
var bodyParser = require('body-parser');
var Firebase = require("firebase");
var myFirebaseRef = new Firebase("https://incandescent-fire-6785.firebaseio.com/");
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var appID = 'f0198a4a';
var appKey = '1c0db97504469966dd4aab4850e32c4e';

var port = process.env.PORT || 8080;

var request = require('request');

var routerInputs = express.Router();
var router = express.Router();

routerInputs = express.Router();
routerInputs.route('/test/:user_id').get(function (req, res1) {
    var id = req.params.user_id;
    myFirebaseRef.child(id).set({
        id: {
            city: "San Francisco",
            state: "California",
            zip: 94103
        }
    });
    myFirebaseRef.child("location/city").on("value", function (snapshot) {
        console.log(snapshot.val()); // Alerts "San Francisco"
    });
    res1.json({
        test: "hello"
    });
});

router.route('/food/:food_id/')
    .get(function (req, res1) {
        var foodId = 0;
        request({
            url: 'https://api.nutritionix.com/v1_1/search/+' + req.params.food_id + '?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=' + appID + '&appKey=' + appKey,
            json: true
        }, function (err, res, json1) {
            if (err) {
                throw err;
            } else {
                foodId = json1.hits[0].fields.item_id;
                console.log(json1.hits[0].fields.item_id);
                request({
                    url: 'https://api.nutritionix.com/v1_1/item?id=' + foodId + '&appId=' + appID + '&appKey=' + appKey,
                    json: true
                }, function (err, res, json2) {
                    if (err) {
                        throw err;
                    } else {
                        item = json2.item_name;
                        calories = json2.nf_calories;
                        fatCalories = json2.nf_calories_from_fat;
                        totalFat = json2.nf_total_fat;
                        saturatedFat = json2.nf_saturated_fat;
                        polyFat = json2.nf_polyunsaturated_fat;
                        monoFat = json2.nf_monosaturated_fat;
                        cholesterol = json2.nf_cholesterol;
                        carbohydrates = json2.nf_total_carbohydrate;
                        fiber = json2.nf_dietary_fiber;
                        sugar = json2.nf_sugars;
                        protein = json2.nf_protein;
                        vitaminA = json2.nf_vitamin_a_dv;
                        vitaminC = json2.nf_vitamin_c_dv;
                        calcium = json2.nf_calcium_dv;
                        iron = json2.nf_iron_dv;
                        servingsPerContainer = json2.nf_servings_per_container;
                        servingSize = json2.nf_serving_size_qty;
                        sizeUnit = json2.nf_serving_size_unit;

                        console.log(json2.nf_calories);
                        res1.json({
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
                    }
                });
            }
        });

    });

app.use('/api', router);
app.use('/api', routerInputs);

app.listen(port);
console.log('We are at' + port);