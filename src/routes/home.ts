import express from 'express'
import * as db from '../database/database'

export const homeRouter = express.Router()

homeRouter.get('/', async (req, res) => {
    try {
        const communityEvents = await db.getAllEvents(false);
        const officialEvents = await db.getAllEvents(true);
        const userId = req.session.userId;
        if(!userId) {
            throw new Error('User not logged in')
        }
        // add the info if the user is atttending the events or events are created by the user
        const attendedEvents = await db.getAttendedEvents(userId);
        for(const event of communityEvents) {
            event.attended = attendedEvents.some(ae => ae.event_id === event.event_id);
            event.created_by_user = event.organizer === userId;
        }
        for(const event of officialEvents) {
            event.attended = attendedEvents.some(ae => ae.event_id === event.event_id);
            event.created_by_user = event.organizer === userId;
        }
        res.render('index', {communityEvents, officialEvents });
    } catch (error) {
        console.log(error)
        res.render('errorPage', {})
    }
});

