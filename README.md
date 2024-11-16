# Chess Game Server

## Overview

This project is a Node.js-based chess game server that facilitates online multiplayer chess games. The server is implemented using Express.io, Mongoose, and Agenda for task scheduling. It supports features such as user registration, login, session management, matchmaking, and real-time game updates using WebSockets.

## Features

### 🧑‍💻 User Management
- **User Registration**: Register with email and password.
- **Login and Session Management**: Sessions are created for authenticated access.
- **Session-Based Authentication**: Keeps track of logged-in users.

### 🔗 Matchmaking
- **Game Requests**: Players create requests with specific criteria.
- **Pairing Logic**: Matches players based on preferences and ratings.

### ♟️ Real-Time Chess Game
- **WebSocket Updates**: Live game updates and state sharing.
- **Move Broadcasting**: Real-time move sharing between players.

### 📝 Game Records
- **Ongoing Games**: Tracked in the database.
- **Completed Games**: Archived for historical analysis.

### 🔄 Task Scheduling
- Periodically removes outdated games and unfulfilled matchmaking requests using Agenda.

### 📄 PGN Export
- Export completed games in PGN format, a standard format for chess notation.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.io**: Combines Express and Socket.io for HTTP and WebSocket handling.
- **Mongoose**: MongoDB object modeling for schema-based data management.
- **Agenda**: Task scheduling and background job management.
- **Socket.io**: Real-time communication for multiplayer games.

## Prerequisites

### Software Requirements
- **Node.js**: v14 or higher.
- **MongoDB**: Local or cloud-based instance.

### Node.js Packages
Install the necessary dependencies using:
```bash
npm install express.io mongoose path agenda ejs
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Set up MongoDB:
   - Ensure MongoDB is running locally or connect to a remote database.
   - Default database name: `satranc`.

3. Start the server:
   ```bash
   node server.js
   ```
   The server will listen on 

http://localhost:3000

.

## API Endpoints

### User Management
- **POST /giris/:eposta/:sifre**: Login and create a session.
- **POST /kayit/:kullanici/:eposta/:sifre/:ulke**: Register a new user.

### Game Functionality
- **GET /**: Redirect to `/giris` if not logged in; otherwise, load the game dashboard.
- **GET /pgn/:oyun**: Download the PGN file for a specific game.

## Real-Time Communication

Implemented via Socket.io. Supported Events:
- **hesap_kontrol**: Check if a user exists.
- **eposta_kontrol**: Check if an email is registered.
- **oyunkur**: Create a new game.
- **oyunoyna**: Start a game.
- **hamleler**: Record and broadcast moves.
- **berabere**: Propose or accept a draw.
- **oyunbitti**: End a game.

## Database Structure

### Collections
- **oturumlar**: Manages user sessions and current game states.
- **kullanicilar**: Stores user account details.
- **oyunlar**: Tracks ongoing games.
- **bitenoyunlar**: Archives completed games.
- **adayoyunlar**: Stores game requests for matchmaking.
- **captcha**: Stores random strings for CAPTCHA validation.

## Task Scheduler

Using Agenda, the server periodically:
- Cleans up offline games.
- Removes outdated matchmaking requests.

### Example Task Setup
```js
gorev.define('biten_oyun', function(job, done) {
  // Game cleanup logic
  done();
});

gorev.every('3 seconds', 'biten_oyun');
```

## Real-Time Communication

The server uses WebSockets for player interactions, broadcasting:
- Moves (

hamleler

 event).
- Matchmaking results.
- Notifications for draw offers, disconnections, and reconnections.

## File Structure

```bash
/public      # Static files (CSS, JS, etc.)
/views       # HTML templates rendered using EJS
server.js    # Main server file
```

## How to Play

1. **Register or Log in**.
2. **Matchmaking**:
   - Choose game criteria.
   - Wait for pairing.
3. **Start the game**:
   - Play moves in real time.
   - Chat and interact with your opponent.

## Development Notes

- **Sessions**: Handled using express-session with a secret key.
- **Socket Management**: Each user session is tied to a WebSocket for live updates.
- **Security**: Passwords are stored in plain text (consider using bcryptjs for hashing in production).
- **Error Handling**: Logs errors for database operations and WebSocket interactions.

## Future Improvements

- Use password hashing (bcryptjs) for secure authentication.
- Implement HTTPS for secure communication.
- Add a frontend UI using React or Angular.
- Integrate player rankings and advanced game analytics.

## License

This project is licensed under the MIT License.

Enjoy playing chess! 🏆♟️