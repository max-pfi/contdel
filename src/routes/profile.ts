import express from 'express'
import * as db from '../database/database'


export const profileRouter = express.Router()

profileRouter.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if(!userId) {
            throw new Error('User not logged in')
        }
        const myEvents = await db.getAttendedEvents(userId)
        const hostedEvents = await db.getHostedEvents(userId)
        for(const event of myEvents) {
            event.attended = true
            event.number_of_attendees = (await db.getEventAttendees(event.event_id)).length
            event.created_by_user = false
        }
        for(const event of hostedEvents) {
            event.attended = false
            event.number_of_attendees = (await db.getEventAttendees(event.event_id)).length
            event.created_by_user = true
        }
        res.render('profile', { myEvents, hostedEvents })

    } catch (error) {
        console.log(error)
        res.render('errorPage', {})
    }
})


profileRouter.delete('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        if(!userId) {
            throw new Error('User not logged in')
        }
        const hostedEvents = await db.getHostedEvents(userId)
        for(const event of hostedEvents) {
            await db.deleteEvent(event.event_id) // delete all events hosted by the user
        }
        const result = await db.deleteUser(userId)
        if(result[0].affectedRows === 1) {
            req.session.destroy((err) => {
                if (err) {
                  console.error('Error destroying session:', err)
                }
                res.status(200).send('User deleted')
              })
        } else {
            throw new Error('User not found')
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }

})
