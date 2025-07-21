


# Social-Connect 💬

Social-Connect is a fully responsive and interactive social networking web application built with Node.js, Express.js, and MongoDB. Users can register, authenticate securely, create and manage posts, like content, and upload profile pictures — all in real time with a clean user experience.


## 🌟 Features

- 🔐 Secure user authentication (JWT)
- ✍️ Create, edit, and delete posts
- ❤️ Like and unlike posts
- 🖼️ Upload and display profile pictures
- 🔒 Passwords hashed securely (bcrypt.js)
- 🌐 Responsive UI with EJS templates & Tailwind CSS
- 💾 Data persistence with MongoDB and Mongoose

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, EJS (Embedded JavaScript), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication & Security**: JWT, bcrypt.js
- **Tools**: Git, GitHub, VS Code

## ⚡ Quick Start

1. Clone the repository:
   ```sh
   git clone https://github.com/Sayannaskar1/Social-Connect.git
   cd Social-Connect/Social-Connect
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_URL=your-mongodb-url
   SECRET_KEY=your-secret-key
   ```
4. Start the development server:
   ```sh
   npm start
   ```
5. Visit `http://localhost:3000` in your browser.

## 🚀 Deployment (Railway)

1. Push your code to GitHub.
2. Create a new project in Railway and link your GitHub repo.
3. Set the environment variables `PORT`, `DB_URL`, and `SECRET_KEY` in the Railway dashboard.
4. Deploy!

## 🔑 Environment Variables

| Variable     | Description                |
|------------- |----------------------------|
| PORT         | Port number (default: 3000)|
| DB_URL       | MongoDB connection string  |
| SECRET_KEY   | JWT secret key             |

## 🧑‍💻 Usage

- Register a new account
- Log in securely
- Create, edit, and delete posts
- Like and unlike posts
- Upload and update your profile picture

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## 📄 License

This project is licensed under the MIT License.



