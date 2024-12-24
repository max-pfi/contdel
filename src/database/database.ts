import mysql, { ResultSetHeader } from 'mysql2'
import dotenv from 'dotenv'
import { User } from '../model/user'
import { EventItem } from 'src/model/event'
dotenv.config()

// Create a connection pool to be used by the application
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

// get all events with the number of attendees, filterd by current date and official status
export async function getAllEvents(official: boolean) {
    const query = `
    SELECT 
        e.event_id,
        e.name,
        e.max_attendees,
        e.description,
        e.date,
        e.time,
        e.zip_code,
        e.address,
        e.organizer,
        e.image_url,
        e.official,
        COUNT(ea.user_id) AS number_of_attendees
    FROM 
        events e
    LEFT JOIN 
        event_attendees ea ON e.event_id = ea.event_id
    WHERE 
        e.official = ?
    AND
        e.date >= CURRENT_DATE
    GROUP BY 
        e.event_id
    ORDER BY
        e.date ASC
    `
    const [events] = await pool.query(query, [official ? 1 : 0])
    return events as EventItem[]
}

// get a single event with the number of attendees
export async function getEvent(eventId: number) {
    const query = `
    SELECT 
        e.event_id,
        e.name,
        e.max_attendees,
        e.description,
        e.date,
        e.time,
        e.zip_code,
        e.address,
        e.organizer,
        e.image_url,
        e.official,
        COUNT(ea.user_id) AS number_of_attendees
    FROM 
        events e
    LEFT JOIN 
        event_attendees ea ON e.event_id = ea.event_id
    WHERE 
        e.event_id = ?
    GROUP BY 
        e.event_id
    `
    const [events] = await pool.query(query, [eventId])
    if (!(events instanceof Array && events.length === 1)) {
        throw new Error('Event not found');
    }
    return events[0] as EventItem
}

// get all users attending a specific event (leave out password and email for security reasons)
export async function getEventAttendees(eventId: number) {
    const query = `
    SELECT 
        u.name,
        u.user_id,
        u.role_id
    FROM 
        event_attendees ea
    JOIN 
        users u ON ea.user_id = u.user_id
    WHERE 
        ea.event_id = ?
    `
    const [attendees] = await pool.query(query, [eventId])
    return attendees as User[]
}

// get a user by email for authentication
export async function getUserByEmail(email: string) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if(!(rows instanceof Array && rows.length === 1)) {
        return null;
    }
    return rows[0] as User
}


// get a user by id
export async function getUser(userId: number) {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId])
    if(!(rows instanceof Array && rows.length === 1)) {
        throw new Error('User not found');
    }
    return rows[0] as User
}


// get all events a user is attending filtered by current date
export async function getAttendedEvents(userId: number) {
    const query = `
    SELECT 
        *
    FROM 
        events e
    JOIN 
        event_attendees ea ON e.event_id = ea.event_id
    WHERE 
        ea.user_id = ?
    AND
        e.date >= CURRENT_DATE
    ORDER BY
        e.date ASC
    `
    const [events] = await pool.query(query, [userId])
    return events as EventItem[]
}

// get all events a user is hosting
export async function getHostedEvents(userId: number) {
    const query = `
    SELECT 
        *
    FROM 
        events e
    WHERE 
        e.organizer = ?
    ORDER BY
        e.date ASC
    `
    const [events] = await pool.query(query, [userId])
    return events as EventItem[]
}

export async function joinEvent(eventId: number, userId: number) {
    const result = await pool.query('INSERT INTO event_attendees (event_id, user_id) VALUES (?, ?)', [eventId, userId])
    return result as ResultSetHeader[]
}

export async function leaveEvent(eventId: number, userId: number) {
    const result = await pool.query('DELETE FROM event_attendees WHERE event_id = ? AND user_id = ?', [eventId, userId])
    return result as ResultSetHeader[]
}

export async function addEvent(event: EventItem) {
    const result = await pool.query('INSERT INTO events (name, description, date, time, zip_code, address, organizer, image_url, official, max_attendees) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [event.name, event.description, event.date, event.time, event.zip_code, event.address, event.organizer, event.image_url, event.official, event.max_attendees])
    return result as ResultSetHeader[]
}

export async function updateEvent(event: EventItem) {
    const result = await pool.query('UPDATE events SET name = ?, description = ?, date = ?, time = ?, zip_code = ?, address = ?, image_url = ?, official = ?, max_attendees = ? WHERE event_id = ?', [event.name, event.description, event.date, event.time, event.zip_code, event.address, event.image_url, event.official, event.max_attendees, event.event_id])
    return result as ResultSetHeader[]
}

// delete event and all connections to it
export async function deleteEvent(eventId: number) {
    await pool.query('DELETE FROM event_attendees WHERE event_id = ?', [eventId])
    const result = await pool.query('DELETE FROM events WHERE event_id = ?', [eventId])
    return result as ResultSetHeader[]
}


// delete user and all connecttions to any events
export async function deleteUser(userId: number) {
    await pool.query('DELETE FROM event_attendees WHERE user_id = ?', [userId])
    const result = await pool.query('DELETE FROM users WHERE user_id = ?', [userId])
    return result as ResultSetHeader[]
}

export async function createUser(name: string, email: string, password: string, role_id: number) {
    const result = await pool.query('INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)', [name, email, password, role_id])
    return result as ResultSetHeader[]
}