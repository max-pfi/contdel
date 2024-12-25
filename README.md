# meetUp

## Project idea
MeetUp is WebApp where users can create events (from sport events to social meet ups) and share them with the cummnity to find people with the same interests and join them.

## Main features
Users are only able to access the site after creating an account. They can view all events cretaed by other users and join them. They can also create their own events and share them with the community.
There are also "official events" which are created by admins. These events are shown in a separate list and highlighted. 

## Technologies
Node.js with typescript was used for the backend and the frontend is rendered with EJS. Javascript is used in the frontend for Dom Manipulation. Data is stored in a mysql database.

The following libraries were used:
- bcrypt for password hashing
- dotenv for environment variables
- express for the server
- express-session for session handling
- multer for file uploads
- mysql2 for the database connection
- typescript for the backend

## Project Structure
- `app.ts` is the entry point for the server
    - handles routing and middleware
- `public` contains the static files for the frontend
- `views` contains the ejs files for the frontend
- `data` contains the sql file to create the database
- `dist` contains the compiled typescript files
- `src` contains the typescript files
    - `src/routes` contains the routes for the server
    - `src/models` contains the models for the database
    - `src/database` contains the database connection file
- `src/types` contains the types for the server

## Setup
### Needed
- Node.js
- Docker Desktop
- Ansible cli
- Terraform cli

### Startup Development
- navigate to the project folder (exercise)
- run `npm i`
- create a `.env` with the needed config names and passwords (example in the repo)
- run `npm run dev-db:start` to start a container with the mysql server
    - the sql file `date/CreateDB.sql` will create the tables and fill in test data
- to start in dev mode run `npm run dev`
    - this will use nodemon
- to compile and start the project use `npm run dev`
- run `npm run dev-db:stop` to stop the container	

## Server configuration and setup
The server setup is done with terraform and ansible. It will create the server, install docker and docker compose, create the needed directories and copy a db init script to the server. To deploy the application see the next steps.
- make sure terraform and ansible are installed
- setup a working ssh key and api token for the digital ocean account
- run `terraform init` to initialize the terraform project
- run `terraform plan` to see the changes that will be made
- run `terraform apply` to apply the changes
- provide the prompted variables:
    - do_token: your digital ocean API token
    - pvt_key: the path to your private key
    - ssh_name: the name of the ssh key on digital ocean
- run `terraform destroy` to destroy the server (will delete all data)

## Deployment
- update the version in the `package.json` file
- add a tag in the format `vX.X.X` to the commit
- push the tag and wait for the pipeline to finish
    - a docker image with the tag will be saved to the registry
- ssh into the server and login to ghcr.io with:
    - `docker login --username max-pfi ghcr.io`
    - provide the personal access token
- navigate to the app directory: `cd /app`
- run `docker-compose down` to stop the currently running containers
- change the used image in the `docker-compose.yml`
    - `vim docker-compose.yml` and enter the correct image tag
- run `docker-compose up -d` to start the updated application  


## Authors
- Max Pfisterer


## Contributing
Contributing is not possible at the moment. If you have any questions or suggestions feel free to contact me.

## Project status
The project is completed in its current state, but it is possible that features might get added later on.
