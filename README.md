# Attendance System
- The Attendance System is a web application for managing attendance using facial recognition.
- The Live Attendance System is a web-based application that allows users to take attendance in real-time using face recognition.
- It is designed to simplify attendance tracking for events, classes, meetings, and other gatherings.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Tech Stacks](#tech-stacks)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [API Documentation](#api-documentation)
- [Contribution](#contribution)
- [License](#license)

## Installation
```bash
   git clone https://github.com/imCyberMohsin/Attendance-System_NodeJS.git
   cd Attendance-System_NodeJS
   npm i
```
```### Install Node Dependencies : ~ npm install
Setup Node Environment
Start the server: ~ node ./index.js
```
```### MongoDB DB Setup
Download & Install MongoDB Server Locally

*OR Setup MongoAtlas Server and then follow the below steps*
1.Create .env file in the root directory
2.Create a variable 'MONGO_URL' in the .env file and paste the mongoAtlas connection URL. 
```

## Usage
```
- Open your web browser and navigate to http://localhost:3000.
- Explore the features of the Attendance System.
```

# Features
```Facial recognition-based attendance tracking.
- User authentication and registration.
- Password encryption using bcrypt.
- Dynamic updating of attendance data in real-time.
- User-friendly web interface for easy navigation.
- Downloadable attendance reports.
```

# Tech Stacks 
- Node.js: The server-side runtime environment for running JavaScript code.
- Express.js: A minimal and flexible Node.js web application framework used to build the backend server, handle routing, and manage middleware.
- MongoDB: A NoSQL database used to store user information, attendance records, and other data.
- Mongoose: A library for MongoDB and Node.js, providing connection & interaction with the database.
- Face-api.js: A JavaScript library for face detection and recognition, employed to implement facial recognition-based attendance tracking in the web application.
- EJS: A simple and effective template engine, to create dynamic HTML pages with integrated JS.
- bcrypt: A library for hashing and salting passwords, enhancing the security of user authentication in the system.

## Project Structure
```bash
/models             # Database models or Schemas
    - user.js 
    - attendance.js
/public             # Static files used in the project
    - css
    - images
    - js
    - labels
    - models
/views              # EJS views
    - root.ejs
    - register.ejs
    - login.ejs
    - home.ejs
    - scanner.ejs
    - viewReport.ejs
/node_modules       # Node Environment Dependencies
package.json        # Info & Packages of the project
package-lock.json   # Lock the versions of packages 
index.js            # Main Server File
.gitignore          # files to be ignored while push
```

## Dependencies
```js
"bcrypt"  : "^5.1.1",    # Password Hashing
"ejs"     : "^3.1.9",    # Template Engine
"express" : "^4.18.2",   # Node.js Framework
"mongoose": "^8.0.0",    # MongoDB Connection
```

## API Documentation
- The face-api.js is a JavaScript library for face detection and recognition in the browser environment.
- it leverages pre-trained machine learning models to perform tasks such as face detection, facial landmark detection, and face recognition. 
[Open face-api-js docs ](https://github.com/justadudewhohacks/face-api.js)

## Contribution
```
- Fork the repository.
- Create a new branch: git checkout -b feature-name.
- Make your changes and commit them: git commit -m 'Add feature'.
- Push to the branch: git push origin feature-name.
- Submit a pull request.
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

Thanks To The face-api-js library, It is licensed under the MIT License - see the [face-api-js LICENSE](https://github.com/justadudewhohacks/face-api.js/blob/master/LICENSE) for details.