# Live Collaborative Code Editor

A simple, elegant real-time collaborative code editor where users can join a room, edit code together, and see each other's cursors and presence.

## Features
- Real-time collaborative code editing
- Room-based sessions (multiple rooms supported)
- See all users in the room (with avatars)
- Live cursor highlighting for all users
- Usernames and rooms are remembered (localStorage)
- Simple, modern, and responsive UI
- Leave room and rejoin easily

## Technologies Used
- **Frontend:** HTML, CSS, [Monaco Editor](https://microsoft.github.io/monaco-editor/), Socket.IO client
- **Backend:** Node.js, Express, Socket.IO, MongoDB (Mongoose)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd CodeEditor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure MongoDB
Create a `.env` file in the `config/` directory or in the root with:
```
DB_URL=mongodb://localhost:27017/codeeditor
```
Or use your own MongoDB connection string.

### 4. Start the server
```bash
npm start
```

### 5. Open the app
Go to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Enter your name and a room name to join or create a room.
- Share the room name with others to collaborate in real time.
- See all users in the sidebar and their live cursors in the editor.
- Click "Leave Room" to exit and return to the join screen.