const {dishService} = require("../services/dishService");

const dishDataController = {
    getAllDishes: async function(req, res) {
        try {
            res.send(await dishService.getAllDishes());
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
};

module.exports = {
    dishDataController,
}