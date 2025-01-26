/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest'
import { app, server } from '../app'
import * as db from '../src/database/database'
import path from 'path'

jest.mock('../src/database/database')

jest.mock('express-session', () => {
  return () => (req: any, res: any, next: any) => {
    req.session = { userId: 1 }
    next()
  }
})

describe('Home Routes', () => {
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

  describe('GET /', () => {
    it('fetches community and official events and renders the home page', async () => {
      const mockCommunityEvents = [
        {
          event_id: 1,
          name: 'Community Event 1',
          description: 'community event.',
          date: new Date(),
          time: 5,
          zip_code: '12345',
          address: 'Address',
          organizer: 1,
          max_attendees: 100,
          image_url: 'community.jpg',
          official: false,
        },
      ]

      const mockOfficialEvents = [
        {
          event_id: 2,
          name: 'Official Event 1',
          description: 'official event.',
          date: new Date(),
          time: 5,
          zip_code: '12345',
          address: 'Address',
          organizer: 2,
          max_attendees: 100,
          image_url: 'official.jpg',
          official: true,
        },
      ]

      const mockAttendedEvents = [{ event_id: 1, user_id: 1 }]

      ;(db.getAllEvents as jest.Mock).mockImplementation((official: boolean) => {
        return official ? mockOfficialEvents : mockCommunityEvents
      })
      ;(db.getAttendedEvents as jest.Mock).mockResolvedValue(mockAttendedEvents)

      const response = await request(app).get('/')

      expect(response.status).toBe(200)
      expect(db.getAllEvents).toHaveBeenCalledWith(false)
      expect(db.getAllEvents).toHaveBeenCalledWith(true)
      expect(response.text).toContain('Community Event 1')
      expect(response.text).toContain('Official Event 1')
    })
  })
})
