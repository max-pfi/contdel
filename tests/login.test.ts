import request from 'supertest'
import { app, server } from '../app'
import * as db from '../src/database/database'
import bcrypt from 'bcryptjs'

jest.mock('../src/database/database')
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

jest.mock('express-session', () => {
  return () => (req: any, res: any, next: any) => {
    req.session = {}
    next()
  }
})

describe('Login Routes', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  describe('POST /login/register', () => {
    it('registers a new user', async () => {
      ;(db.getUserByEmail as jest.Mock).mockResolvedValue(null)
      ;(db.createUser as jest.Mock).mockResolvedValue([{ affectedRows: 1 }])
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password')

      const response = await request(app).post('/login/register').send({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        username: 'Test User',
      })

      expect(response.status).toBe(302)
      expect(db.getUserByEmail).toHaveBeenCalledWith('test@example.com')
      expect(db.createUser).toHaveBeenCalledWith('Test User', 'test@example.com', 'hashed_password', 1)
    })

    it('returns an error if passwords do not match', async () => {
      const response = await request(app).post('/login/register').send({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'wrongPassword',
        username: 'Test User',
      })

      expect(response.status).toBe(302)
      expect(response.header.location).toContain('/login/register?error=1')
    })

    it('returns an error if the user already exists', async () => {
      ;(db.getUserByEmail as jest.Mock).mockResolvedValue({ email: 'test@example.com' })

      const response = await request(app).post('/login/register').send({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        username: 'Test User',
      })

      expect(response.status).toBe(302)
      expect(response.header.location).toContain('/login/register?error=2')
    })

    it('returns an error if user creation fails', async () => {
      ;(db.getUserByEmail as jest.Mock).mockResolvedValue(null)
      ;(db.createUser as jest.Mock).mockResolvedValue([{ affectedRows: 0 }])

      const response = await request(app).post('/login/register').send({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        username: 'Test User',
      })

      expect(response.status).toBe(302)
      expect(response.header.location).toContain('/login/register?error=1')
    })
  })

  describe('POST /login', () => {
    it('returns an error for incorrect credentials', async () => {
      ;(db.getUserByEmail as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        password: 'hashed_password',
        user_id: 1,
      })
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const response = await request(app).post('/login').send({
        email: 'test@example.com',
        password: 'wrongPassword',
      })

      expect(response.status).toBe(302)
      expect(response.header.location).toContain('/login?error=2')
    })

    it('returns an error for a non-existent user', async () => {
      ;(db.getUserByEmail as jest.Mock).mockResolvedValue(null)

      const response = await request(app).post('/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      })

      expect(response.status).toBe(302)
      expect(response.header.location).toContain('/login?error=2')
    })
  })
})
