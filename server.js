var express = require('express'); // call express
var http = require("http");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var request = require('request');

var router = express.Router();

router.route('/food/:food_id')
    .get(function (req, res1) {
        var foodId = 0;
        request({
            url: 'https://api.nutritionix.com/v1_1/search/+' + req.params.food_id + '?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id&appId=f0198a4a&appKey=40ebd8830ab41d47ff4f6989420a3c07',
            json: true
        }, function (err, res, json1) {
            if (err) {
                throw err;
            } else {
                foodId = json1.hits[0].fields.item_id;
                console.log(json1.hits[0].fields.item_id);
                request({
                    url: 'https://api.nutritionix.com/v1_1/item?id=' + foodId + '&appId=f0198a4a&appKey=40ebd8830ab41d47ff4f6989420a3c07',
                    json: true
                }, function (err, res1, json2) {
                    if (err) {
                        throw err;
                    } else {
                        calories = json2.nf_calories;
                        console.log(json2.nf_calories);
                        res1.json({
                            calories: calories
                        });
                    }
                });
            }
        });

    });

app.use('/api', router);

app.listen(port);
console.log('We are at' + port);