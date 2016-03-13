# NutritionAPI

To get nutrition for a food:
https://morning-basin-19700.herokuapp.com/api/food/*foodname*/*username*
If the username is new, then Firebase creates a new entry for it. If not, it updates.

Example:
https://morning-basin-19700.herokuapp.com/api/food/banana/Vincent
Returns banana's nutrition in JSON format, and adds banana nutrients to Vincent's total nutrients in Firebase.

To get user information:
https://morning-basin-19700.herokuapp.com/api/info/*username*
Returns nutrient data for selected user.

Example:
https://morning-basin-19700.herokuapp.com/api/info/Vincent
Returns Vincent's total consumed nutrients in a JSON file.

To delete user:
https://morning-basin-19700.herokuapp.com/api/delete/*username*
Deletes user.
