import { Router } from 'express'
import scheduledJobsController from '../controllers/scheduledJobsController.js';

const router = Router()

// Schedules the reminder to return the dish
// Requires transId, userId, dishId as query params
router.get('/dishCheckout', async (req, res, next) => {
    try {
        let transId = req.query.transId;
        let userId = req.query.userId;
        let dishId = req.query.dishId;
        scheduledJobsController.dishCheckoutReturnReminder(transId, userId, dishId);
        res.send('Request Confirmed');
    } catch(err) {
        res.status(400).send(err.message);
    }
    
});

export default router;