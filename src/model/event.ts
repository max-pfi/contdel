export interface EventItem {
    event_id: number
    name: string
    description: string
    date: Date
    time: number
    zip_code: string
    address: string
    organizer: number
    max_attendees: number
    image_url: string
    official: boolean
    number_of_attendees?: number
    attended?: boolean
    created_by_user?: boolean
}