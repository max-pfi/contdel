drop table if exists event_attendees;
drop table if exists events;
drop table if exists users;
drop table if exists roles;


create table roles (
    role_id int(8),
    name varchar(100) not null,
    primary key (role_id)
);

create table users (
    user_id int(8) auto_increment,
    name varchar(50) not null,
    password varchar(200) not null,
    email varchar(50) not null,
    role_id int(8) not null,

    foreign key (role_id) references roles(role_id),
    primary key (user_id)
);

create table events (
    event_id int(8) auto_increment,
    name varchar(30) not null,
    description varchar(600) not null,
    date datetime not null,
    time int(4) not null,
    max_attendees int(4) not null,
    zip_code varchar(5) not null,
    address varchar(100) not null,
    organizer int(8) not null,
    image_url varchar(150) not null,
    official boolean default false,

    foreign key (organizer) references users(user_id),
    primary key (event_id)
);

create table event_attendees (
    event_id int(8),
    user_id int(8),

    foreign key (event_id) references events(event_id),
    foreign key (user_id) references users(user_id),
    primary key (event_id, user_id)
);


-- Insert test entries for roles
insert into roles (role_id, name)
values
    (1, 'User'),
    (2, 'Admin');

-- Insert test entries for users
insert into users (name, email, role_id, password)
values
    ('Max', 'max@com', 1, '$2b$10$vGjWO/1ZWyMXZZqCgmij1Ouo7otwl0p/Uqa.itXToY8eF9BslN072'),
    ('John Doe', 'john.doe@example.com', 1, '$2b$10$vGjWO/1ZWyMXZZqCgmij1Ouo7otwl0p/Uqa.itXToY8eF9BslN072'),
    ('Jane Smith', 'jane.smith@example.com', 1, '$2b$10$vGjWO/1ZWyMXZZqCgmij1Ouo7otwl0p/Uqa.itXToY8eF9BslN072'),
    ('Michael Johnson', 'michael.johnson@example.com', 1, '$2b$10$vGjWO/1ZWyMXZZqCgmij1Ouo7otwl0p/Uqa.itXToY8eF9BslN072'),
    ('Emily Davis', 'emily.davis@example.com', 1, '$2b$10$vGjWO/1ZWyMXZZqCgmij1Ouo7otwl0p/Uqa.itXToY8eF9BslN072'),
    ('David Wilson', 'david.wilson@example.com', 2, '$2b$10$vGjWO/1ZWyMXZZqCgmij1Ouo7otwl0p/Uqa.itXToY8eF9BslN072');

-- Insert test entries for events
insert into events (name, description, date, time, max_attendees, zip_code, address, organizer, image_url)
values
    ('Volleyball', 'Play some exciting volleyball matches! Join us for a day filled with intense competition and thrilling rallies. Whether you are a seasoned player or a beginner, this event is perfect for everyone. Dont miss out on the opportunity to showcase your skills and have a great time!', '2024-03-10', 4, 2, '67890', 'Beach Volleyball Court', 3, 'volleyball.jpg'),
    ('Table Tennis', 'Compete in a table tennis tournament! Test your agility and precision in this fast-paced sport. With players of all levels participating, you will have the chance to challenge yourself and improve your game. Join us for an exciting day of intense matches and friendly competition!', '2024-04-05', 2, 2, '09876', 'Sports Club', 4, 'tabletennis.jpg'),
    ('Climbing Outdoor', 'Enjoy outdoor rock climbing! Embark on an adventure and conquer the heights with our experienced guides. Whether you are a beginner or an experienced climber, this event offers a variety of routes suitable for all skill levels. Take in the breathtaking views and push your limits in a safe and supportive environment!', '2024-05-15', 1, 2, '13579', 'Mountain Range', 5, 'climbing.jpg');

-- Insert test entries for events
insert into events (name, description, date, time, max_attendees, zip_code, address, organizer, image_url, official)
values
    ('Skiing', 'Join us for a fun day of skiing! Hit the slopes and experience the thrill of gliding through fresh powder. Whether you are a beginner or an expert, this event offers something for everyone. Enjoy the beautiful mountain scenery and make unforgettable memories with fellow skiing enthusiasts!', '2024-04-15', 2, 2, '12345', 'Ski Resort', 2, 'skiing.jpg', 1),
    ('Downhill', 'Experience the thrill of downhill racing! Feel the adrenaline rush as you navigate through challenging slopes at high speeds. This event is perfect for thrill-seekers and experienced skiers looking for an exciting competition. Join us for an unforgettable day of intense racing and exhilarating moments!', '2024-02-20', 3, 2, '54321', 'Mountain Peak', 2, 'downhill.jpg', 1);



-- Insert test entries for event_attendees
insert into event_attendees (event_id, user_id)
values
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 4),
    (4, 5),
    (5, 1);

