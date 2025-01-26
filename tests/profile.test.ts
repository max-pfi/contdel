/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest'
import { app, server } from '../app'
import * as db from '../src/database/database'
import path from 'path'

jest.mock('../src/database/database')

jest.mock('express-session', () => {
  return () => (req: any, res: any, next: any) => {
    req.session = { userId: 1, destroy: jest.fn((callback) => callback(null)) }
    next()
  }
})

describe('Profile Routes', () => {
  beforeAll(() => {
    app.set('views', path.join(__dirname, '../views'))
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  afterAll(() => {
    server.close()
  })

  describe('GET /profile', () => {
    it('fetches user’s events', async () => {
      const mockMyEvents = [
        {
          event_id: 1,
          name: 'My Event',
          description: 'event',
          date: new Date(),
          time: 5,
          zip_code: '12345',
          address: 'Address',
          organizer: 2,
          max_attendees: 100,
          image_url: 'myevent.jpg',
          official: false,
        },
      ]

      const mockHostedEvents = [
        {
          event_id: 2,
          name: 'Hosted Event',
          description: 'event',
          date: new Date(),
          time: 5,
          zip_code: '12345',
          address: 'Address',
          organizer: 1,
          max_attendees: 100,
          image_url: 'hostedevent.jpg',
          official: true,
        },
      ]

      const mockAttendees = [{ user_id: 1 }, { user_id: 2 }]

      ;(db.getAttendedEvents as jest.Mock).mockResolvedValue(mockMyEvents)
      ;(db.getHostedEvents as jest.Mock).mockResolvedValue(mockHostedEvents)
      ;(db.getEventAttendees as jest.Mock).mockResolvedValue(mockAttendees)

      const response = await request(app).get('/profile')

      expect(response.status).toBe(200)
      expect(db.getAttendedEvents).toHaveBeenCalledWith(1)
      expect(db.getHostedEvents).toHaveBeenCalledWith(1)
      expect(response.text).toContain('My Event')
      expect(response.text).toContain('Hosted Event')
    })
  })

  describe('DELETE /profile', () => {
    it('deletes the user and their hosted events', async () => {
      const mockHostedEvents = [
        { event_id: 1, organizer: 1 },
        { event_id: 2, organizer: 1 },
      ]

      ;(db.getHostedEvents as jest.Mock).mockResolvedValue(mockHostedEvents)
      ;(db.deleteEvent as jest.Mock).mockResolvedValue({})
      ;(db.deleteUser as jest.Mock).mockResolvedValue([{ affectedRows: 1 }])

      const response = await request(app).delete('/profile')

      expect(response.status).toBe(200)
      expect(db.getHostedEvents).toHaveBeenCalledWith(1)
      expect(db.deleteEvent).toHaveBeenCalledTimes(mockHostedEvents.length)
      expect(db.deleteUser).toHaveBeenCalledWith(1)
      expect(response.text).toContain('User deleted')
    })

    it('returns an error if the user is not found', async () => {
      (db.getHostedEvents as jest.Mock).mockResolvedValue([]);
      (db.deleteUser as jest.Mock).mockResolvedValue([{ affectedRows: 0 }])

      const response = await request(app).delete('/profile')

      expect(response.status).toBe(500)
      expect(response.text).toContain('Internal Server Error')
    })
  })
})
