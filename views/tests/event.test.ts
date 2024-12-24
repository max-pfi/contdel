import { checkInput } from "../../src/routes/event";

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
        };
        expect(() => checkInput(event)).toThrow('Invalid title input');
    });

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
        };
        expect(() => checkInput(event)).toThrow('Invalid description input');
    });

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
        };
        expect(() => checkInput(event)).toThrow('Invalid duration input');
    });

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
        };
        expect(() => checkInput(event)).toThrow('Invalid number of attendees input');
    });

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
        };
        expect(() => checkInput(event)).toThrow('Invalid zip code format input');
    });

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
        };
        expect(() => checkInput(event)).toThrow('Invalid address input');
    });

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
        };
        expect(() => checkInput(event)).not.toThrow();
    });
});
