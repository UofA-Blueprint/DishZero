const {dishDataController} = require("../controllers/dishDataController");
const Router = require("express").Router;

const router = Router()

// Return all the dishes
router.get('/all', async (req, res, next) => {
    await dishDataController.getAllDishes(req, res);
});

module.exports = {
    router
}