
# Continuous Delivery Documentation

## Base Project
- Web App for an event platform where users can create and join events
- Express server with typescript and EJS for the frontend
- Mysql database (docker container)

## Used Technologies for Continuous Delivery
- `Jest` for testing
- `Docker` for containerization
- `Terraform` for infrastructure as code
- `Ansible` for configuration management
- `Github Actions` for CI/CD
- `Digital Ocean` for hosting


## Automated Tests
- `Jest` is used as the primary testing framework for running and managing test cases
- For integration tests, `supertest` is used
- `jest-html-reporter` is used to generate a html report of the test results
- The tests can be run with `npm run test`
- All database data is mocked so the tests can be run without a database connection

## Containerization
- For local development the `docker-compose.yml` file from the `dev-setup` folder can be used
    - it creates just the database container
    - the database is initialized with the `CreateDB.sql` file from the `data` folder on the first startup
- The `docker-compose.yml` file in the root folder is used for the production setup
- This creates both database and server containers
- For the database there is the addional volume `db_data` to persist the data
- The server container is built from the Dockerimage uploaded to the Github Container Registry on a new release
    - the base image is `node:18-alpine`
- The server container also has a volume to persist image uploads


## CI/CD Pipeline
- The pipeline is defined in the `.github/workflows` folder
- The following steps are executed on every push to the master branch:
    - `Eslint` check
    - `Jest` tests with coverage and html report
    - Build the project with `npm run build`
- When a new release is created by pushing with a `v`-Tag a new container image is built and pushed to the Github Container Registry
    - The github token is stored in the repository secrets
    - The image is tagged with the release version


## Server Setup and Configuration
- A digital ocean droplet is used for hosting using
    - `ubuntu-24-10-x64`
    - `s-2vcpu-8gb-160gb-intel` - 8GB Memory, 2 vCPUs, 160GB Disk
- The server setup is done with `Terraform` and `Ansible`

### Terraform
- A provider is set up for Digital Ocean which needs the following variables:
    - ssh_name: the name of the ssh key on digital ocean
    - pvt_key: the path to your private key -> this one will actually only be needed later 
    - do_token: your digital ocean API token
- The `contdel.tf` file contains the droplet configuration 
- a local provisioner is used to start the ansible playbook with the correct IP address and needed variables

### Ansible
- The `setup.yml` playbook first installes docker via the script from `https://get.docker.com`
- An app directory is created and the `docker-compose.yml` + `.env` files are copied to the server
- next the `/data` and `/upload` directories are created to have those folders and also provide the initialization data / scripts
- the Base URL in the .env file is set to the public IP of the server

### Running the setup
- make sure terraform and ansible are installed
- setup a working ssh key and api token for the digital ocean account
    - put the name of the ssh_key, the path to the private ssh key and the digital ocean token in the `terraform.tfvars` file
- run `terraform init` to initialize the terraform project
- run `terraform plan` to see the changes that will be made
- run `terraform apply` to apply the changes
- provide the prompted variables:
    - do_token: your digital ocean API token
    - pvt_key: the path to your private key
    - ssh_name: the name of the ssh key on digital ocean
- run `terraform destroy` to destroy the server (will delete all data)



## Deployment
- at the end of the CI/CD pipeline a Docker image is pushed to the Github Container Registry
- to update the server the following steps are needed:
    - ssh into the server and login to ghcr.io with:
        - `docker login --username max-pfi ghcr.io`
        - provide the personal access token
    - navigate to the app directory: `cd /app`
    - run `docker-compose down` to stop the currently running containers
    - change the used image in the `docker-compose.yml`
        - `vim docker-compose.yml` and enter the correct image tag
    - run `docker-compose up -d` to start the updated application  