import { Router } from 'express'
import scheduledJobsController from '../controllers/scheduledJobsController.js';

const router = Router()

// Schedules the reminder to return the dish
// Requires transId, userId, dishId as query params
router.get('/dishCheckout', async (req, res, next) => {
    try {
        let transId = req.query.transId;
        await scheduledJobsController.dishCheckoutReturnReminder(transId);
        res.send('Request Confirmed');
    } catch(err) {
        res.status(400).send(err.message);
    }
});

export default router;