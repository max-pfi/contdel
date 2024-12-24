import express from 'express'
import * as db from '../database/database'
import multer from 'multer'
import path from 'path'
import { EventItem } from 'src/model/event'
import fs from 'fs'

export const eventRouter = express.Router()

// storage for uploaded images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// upload middleware
const upload = multer({ storage: storage })

// route to get a specific event
eventRouter.get('/', async (req, res) => {
    try {
        // get specific event by id and user
        const eventId = parseInt(req.query.id as string)
        const userId = req.session.userId
        if (!userId) {
            throw new Error('User not logged in')
        }
        const currentEvent = await db.getEvent(eventId)
        const attendedEvents = await db.getAttendedEvents(userId);
        currentEvent.attended = attendedEvents.some(ae => ae.event_id === currentEvent.event_id);
        currentEvent.created_by_user = currentEvent.organizer === userId;
        const attendees = await db.getEventAttendees(eventId)
        const organizer = await db.getUser(currentEvent.organizer)
        res.render('eventDetails', { event: currentEvent, attendees, organizer })
    } catch (error) {
        console.log(error)
        res.render('errorPage', {})
    }
})

// join or leave an event
eventRouter.post('/toggleJoin', async (req, res) => {
    try {
        const currentEventId = parseInt(req.body.id)
        const userId = req.session.userId
        if (!userId) {
            throw new Error('User not logged in')
        }
        const user = await db.getUser(userId)
        const attendedEvents = await db.getAttendedEvents(userId)
        const currentEvent = await db.getEvent(currentEventId)
        if (attendedEvents.some(event => event.event_id === currentEventId)) {
            await db.leaveEvent(currentEventId, userId)
            res.json({
                status: 'left',
                userId: userId,
                username: user.name
            })
        } else if (currentEvent.number_of_attendees && currentEvent.number_of_attendees >= currentEvent.max_attendees) {
            res.json({ status: 'full' })
            return
        }
        else {
            await db.joinEvent(currentEventId, userId)
            res.json({
                status: 'joined',
                userId: userId,
                username: user.name
            })
        }
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})

// show add event page
eventRouter.get('/addEvent', async (req, res) => {
    res.render('eventDataInput', {newEvent: true, event: null})
})

// add event
eventRouter.post('/addEvent', upload.single('file'), async (req, res) => {
    try {
        const userId = req.session.userId
        if (!userId || !req.file) {
            throw new Error('User not logged in or no file uploaded')
        }
        const user = await db.getUser(userId)
        const event = {
            name: req.body.title,
            description: req.body.description,
            date: req.body.date,
            time: parseInt(req.body.duration),
            zip_code: req.body.zipCode,
            address: req.body.address,
            organizer: userId,
            max_attendees: parseInt(req.body.maxAttendees),
            image_url: req.file?.filename || 'default.jpg',
            official: parseInt(user.role_id) === 2 // TODO refactor to use enum, currently 2 means offical account and 1 unofficial
        } as EventItem
        checkInput(event)
        const result = await db.addEvent(event)
        if (result[0].insertId) {
            res.json({ status: 'success', id: result[0].insertId })
        } else {
            removeImage(event.image_url)
            res.json({ status: 'error' })
        }
    } catch (error) {
        console.log("error: ", error)
        if (req.file) {
            removeImage(req.file.filename)
        }
        res.status(500).send('Error adding event.')
    }
})

// show edit event page
eventRouter.get('/edit', async (req, res) => {
    try {
        const eventId = parseInt(req.query.id as string)
        const userId = req.session.userId
        const event = await db.getEvent(eventId)
        const timeZoneOffset = event.date.getTimezoneOffset() // calculate time zone offset in minutes
        const htmlDateString = new Date(event.date.getTime() - timeZoneOffset * 60000).toISOString().slice(0, 16) // generate date string for html input
        
        if (!userId) {
            throw new Error('User not logged in')
        } else if (event.organizer !== userId) {
            throw new Error('User not authorized to edit event')
        }
        res.render('eventDataInput', {newEvent: false, event, dateTime: htmlDateString})
    } catch (error) {
        console.log(error)
        res.render('errorPage', {})
    }
})


// edit event
eventRouter.post('/edit', upload.single('file'), async (req, res) => {
    try {
        const userId = req.session.userId
        if (!userId) {
            throw new Error('User not logged in')
        }
        const prevEvent = await db.getEvent(parseInt(req.body.eventId))
        if(req.file) {
            removeImage(prevEvent.image_url)
        }
        const event = {
            event_id: parseInt(req.body.eventId),
            name: req.body.title,
            description: req.body.description,
            date: req.body.date,
            time: parseInt(req.body.duration),
            zip_code: req.body.zipCode,
            address: req.body.address,
            max_attendees: parseInt(req.body.maxAttendees),
            image_url: req.file?.filename || prevEvent.image_url,
            official: prevEvent.official
        } as EventItem
        checkInput(event)
        const result = await db.updateEvent(event)
        if (result[0].affectedRows === 1) {
            res.json({ status: 'success', id: event.event_id })
        } else {
            if(req.file) {
                removeImage(req.file.filename)
            }
            res.json({ status: 'error' })
        }
    } catch (error) {
        console.log("error: ", error)
        if (req.file) {
            removeImage(req.file.filename)
        }
        res.status(500).send('Error updating event.')
    }
})


// delete event
eventRouter.delete('/delete', async (req, res) => {
    try {
        const eventId = parseInt(req.query.id as string)
        const userId = req.session.userId
        if (!userId) {
            throw new Error('User not logged in')
        }
        const event = await db.getEvent(eventId)
        if (event.organizer !== userId) {
            throw new Error('User not authorized to delete event')
        }
        await db.deleteEvent(eventId)
        removeImage(event.image_url)
        res.json({ status: 'success' })
    } catch (error) {
        console.log("error: ", error  )
        res.status(500).send('Internal Server Error')
    }
})

export function removeImage(image_url: string) {
    const filePath = path.join(__dirname, `../../../public/img/uploads/${image_url}`)
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}

// input validation
export function checkInput(event: EventItem) {
    if (!event.name || event.name.length > 30 || typeof event.name !== 'string') {
        throw new Error('Invalid title input');
    }
    if (!event.description || event.description.length > 600 || typeof event.description !== 'string') {
        throw new Error('Invalid description input');
    }
    if (!event.date) {
        throw new Error('Invalid date input');
    }
    if (!event.time || event.time < 1 || event.time > 168 || typeof event.time !== 'number') {
        throw new Error('Invalid duration input');
    }
    if (!event.max_attendees || event.max_attendees < 1 || event.max_attendees > 100 || typeof event.max_attendees !== 'number') {
        throw new Error('Invalid number of attendees input');
    }
    if (!event.zip_code || !event.zip_code.match(/^\d{1,5}$/)) {
        throw new Error('Invalid zip code format input');
    }
    if (!event.address || event.address.length > 100 || typeof event.address !== 'string') {
        throw new Error('Invalid address input');
    }
}