/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkInput } from '../src/routes/event'
import request from 'supertest'
import { app, server } from '../app'
import * as db from '../src/database/database'
import path from 'path'
import fs from 'fs'

jest.mock('../src/database/database')

jest.mock('express-session', () => {
  return () => (req: any, res: any, next: any) => {
    req.session = { userId: 1 }
    next()
  }
})

jest.spyOn(fs, 'unlink').mockImplementation((_, callback) => {
  callback(null)
})

describe('Event Routes', () => {
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

  describe('GET /event', () => {
    it('fetches an event and renders eventDetails', async () => {
      const mockEvent = {
        event_id: 1,
        name: 'Test Event',
        description: 'This is a test event.',
        date: new Date(),
        time: 5,
        zip_code: '12345',
        address: 'Test Address',
        organizer: 1,
        max_attendees: 100,
        image_url: 'test.jpg',
        official: false,
        number_of_attendees: 10,
      }

      const mockAttendedEvents = [mockEvent]
      const mockAttendees = [{ user_id: 1, name: 'User 1' }]
      const mockOrganizer = { user_id: 1, name: 'Organizer' }

      ;(db.getEvent as jest.Mock).mockResolvedValue(mockEvent)
      ;(db.getAttendedEvents as jest.Mock).mockResolvedValue(mockAttendedEvents)
      ;(db.getEventAttendees as jest.Mock).mockResolvedValue(mockAttendees)
      ;(db.getUser as jest.Mock).mockResolvedValue(mockOrganizer)

      const response = await request(app).get('/event').query({ id: 1 })

      expect(response.status).toBe(200)
      expect(db.getEvent).toHaveBeenCalledWith(1)
      expect(response.text).toContain('Test Event')
    })
  })

  describe('POST /event/toggleJoin', () => {
    it('allows users to join an event', async () => {
      const mockUserId = 1
      const mockEventId = 1
      const mockUser = { user_id: 1, name: 'Test User' }
      const mockEvent = {
        event_id: 1,
        max_attendees: 100,
        number_of_attendees: 50,
      }
      const mockAttendedEvents: any[] = []

      ;(db.getUser as jest.Mock).mockResolvedValue(mockUser)
      ;(db.getEvent as jest.Mock).mockResolvedValue(mockEvent)
      ;(db.getAttendedEvents as jest.Mock).mockResolvedValue(mockAttendedEvents)
      ;(db.joinEvent as jest.Mock).mockResolvedValue({})

      const response = await request(app).post('/event/toggleJoin').send({ id: mockEventId })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('joined')
      expect(db.joinEvent).toHaveBeenCalledWith(mockEventId, mockUserId)
    })

    it('should not allow a user to join a full event', async () => {
      const mockEvent = {
        event_id: 1,
        max_attendees: 50,
        number_of_attendees: 50,
      }

      ;(db.getEvent as jest.Mock).mockResolvedValue(mockEvent)
      ;(db.getAttendedEvents as jest.Mock).mockResolvedValue([])

      const response = await request(app).post('/event/toggleJoin').send({ id: 1 })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('full')
    })
  })

  describe('POST /event/addEvent', () => {
    it('should allow user to add an event', async () => {
      const mockUserId = 1
      const mockUser = { user_id: 1, role_id: 1 }
      const mockEvent = {
        name: 'New Event',
        description: 'This is a new event.',
        date: '2023-12-31',
        time: 5,
        zip_code: '12345',
        address: 'New Address',
        organizer: mockUserId,
        max_attendees: 100,
        image_url: 'test.jpg',
        official: false,
      }

      ;(db.getUser as jest.Mock).mockResolvedValue(mockUser)
      ;(db.addEvent as jest.Mock).mockResolvedValue([{ insertId: 1 }])

      const response = await request(app)
        .post('/event/addEvent')
        .field('title', mockEvent.name)
        .field('description', mockEvent.description)
        .field('date', mockEvent.date)
        .field('duration', mockEvent.time)
        .field('zipCode', mockEvent.zip_code)
        .field('address', mockEvent.address)
        .field('maxAttendees', mockEvent.max_attendees)
        .attach('file', Buffer.from('fake file content'), 'test.jpg')

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(db.addEvent).toHaveBeenCalled()
    })
  })

  describe('DELETE /event/delete', () => {
    it('should allow a user to delete their own event', async () => {
      const mockEvent = { event_id: 1, organizer: 1, image_url: 'test.jpg' }

      ;(db.getEvent as jest.Mock).mockResolvedValue(mockEvent)
      ;(db.deleteEvent as jest.Mock).mockResolvedValue({})

      const response = await request(app).delete('/event/delete').query({ id: 1 })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('success')
      expect(db.deleteEvent).toHaveBeenCalledWith(1)
    })
  })

  describe('checkInput', () => {
    it('throws error for invalid name', () => {
      const event = {
        event_id: 1,
        name: '',
        description: 'some description',
        date: new Date(),
        time: 5,
        zip_code: '12345',
        address: 'some adress',
        organizer: 1,
        max_attendees: 50,
        image_url: 'image.jpg',
        official: false,
      }
      expect(() => checkInput(event)).toThrow('Invalid title input')
    })

    it('throws error for invalid description', () => {
      const event = {
        event_id: 1,
        name: 'Some Name',
        description: '',
        date: new Date(),
        time: 5,
        zip_code: '12345',
        address: 'Some address',
        organizer: 1,
        max_attendees: 50,
        image_url: 'image.jpg',
        official: false,
      }
      expect(() => checkInput(event)).toThrow('Invalid description input')
    })

    it('throws error for invalid time', () => {
      const event = {
        event_id: 1,
        name: 'Valid Name',
        description: 'some description',
        date: new Date(),
        time: 200,
        zip_code: '12345',
        address: 'some address',
        organizer: 1,
        max_attendees: 50,
        image_url: 'image.jpg',
        official: false,
      }
      expect(() => checkInput(event)).toThrow('Invalid duration input')
    })

    it('throws error for invalid number of attendees', () => {
      const event = {
        event_id: 1,
        name: 'some Name',
        description: 'some description',
        date: new Date(),
        time: 5,
        zip_code: '12345',
        address: 'Valid address',
        organizer: 1,
        max_attendees: 0,
        image_url: 'image.jpg',
        official: false,
      }
      expect(() => checkInput(event)).toThrow('Invalid number of attendees input')
    })

    it('throws error for invalid zip code format', () => {
      const event = {
        event_id: 1,
        name: 'some Name',
        description: 'some description',
        date: new Date(),
        time: 5,
        zip_code: 'abcde',
        address: 'some address',
        organizer: 1,
        max_attendees: 50,
        image_url: 'image.jpg',
        official: false,
      }
      expect(() => checkInput(event)).toThrow('Invalid zip code format input')
    })

    it('throws an error for invalid address', () => {
      const event = {
        event_id: 1,
        name: 'some Name',
        description: 'some description',
        date: new Date(),
        time: 5,
        zip_code: '12345',
        address: '',
        organizer: 1,
        max_attendees: 50,
        image_url: 'image.jpg',
        official: false,
      }
      expect(() => checkInput(event)).toThrow('Invalid address input')
    })

    it('does not throw for valid input', () => {
      const event = {
        event_id: 1,
        name: 'some Name',
        description: 'Valid description',
        date: new Date(),
        time: 5,
        zip_code: '12345',
        address: 'some address',
        organizer: 1,
        max_attendees: 50,
        image_url: 'image.jpg',
        official: false,
        number_of_attendees: 10,
        attended: true,
        created_by_user: true,
      }
      expect(() => checkInput(event)).not.toThrow()
    })
  })
})
