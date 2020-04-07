# Grid Analyzer Backend Structure
The Backend code to serve the test data to Grid Analyzer Sencha Project


## Getting Started

### Prerequisites

1. Ensure that you have Node.js v10.13.0 or later installed and activated through [nvm](https://github.com/creationix/nvm) if working on macOS:

  ```sh
  nvm install v10.13.0
  nvm use v10.13.0
  ```

  For windows kindly download it from [NodeJS](https://nodejs.org/en/download/)

### Steps
1. To download the project, simply run the following command in your command-line interface tool:
  ```sh
  git clone https://github.com/CelestialSystem/grid_analyzer_backend.git
  ```
or you can download the zip folder.

2. Get inside the project using
  ```sh
  cd grid_analyzer_backend
  ```

3. Run NPM install command.
  ```sh
  npm install
  ```

### To Run the Server

1. To start the server, run
  ```sh
  npm start
  ```
# Local development using Docker

Quick start up :

```
git clone https://github.com/CelestialSystem/grid_analyzer_backend.git
cd grid_analyzer_backend.git
docker-compose up 
or 
docker-compose up -d 
[ -d option is for the detached mode. It will start the services in background.] 
```
After modifying the code, you should run following commands to bring the changes into effect:
```
docker-compose down 
docker-compose up -d --force-recreate
```
For checking the logs:
```
docker-compose --logs --tail=30
```
## Version
It is the first draft of this project.
