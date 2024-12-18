import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// إعداد Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBW7dRC4-hT42_Dj5TsSgflX0MLrSINd6o",
  authDomain: "chat-6c769.firebaseapp.com",
  databaseURL: "https://chat-6c769-default-rtdb.firebaseio.com",
  projectId: "chat-6c769",
  storageBucket: "chat-6c769.firebasestorage.app",
  messagingSenderId: "245550192186",
  appId: "1:245550192186:web:f1238b2f79b05a03250703",
  measurementId: "G-DXXCWXB143"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

// عناصر HTML
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const loginForm = document.getElementById("login-form");
const chatForm = document.getElementById("chat-form");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message");
const profilePictureInput = document.getElementById("profile-picture");

// تخزين اسم المستخدم والصورة
let username = localStorage.getItem("username");
let profilePicture = localStorage.getItem("profilePicture");

// التحقق من تسجيل الدخول
if (username) {
  loginScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
} else {
  chatScreen.classList.add("hidden");
}

// تسجيل الدخول
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  username = document.getElementById("login-username").value.trim();
  const file = profilePictureInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePicture = reader.result;
      localStorage.setItem("username", username);
      localStorage.setItem("profilePicture", profilePicture);
      loginScreen.classList.add("hidden");
      chatScreen.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  } else {
    profilePicture = null;
    localStorage.setItem("username", username);
    loginScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
  }
});

// إرسال رسالة
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (message) {
    push(messagesRef, {
      username,
      message,
      profilePicture,
      timestamp: Date.now(),
    });
    messageInput.value = "";
  }
});

// عرض الرسائل
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  displayMessage(data.username, data.message, data.profilePicture);
});

// وظيفة عرض الرسائل
function displayMessage(username, message, profilePicture) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  const img = document.createElement("img");
  img.src = profilePicture || "https://via.placeholder.com/40";
  img.alt = username;

  const textDiv = document.createElement("div");
  textDiv.innerHTML = `<strong>${username}:</strong> ${message}`;

  messageDiv.appendChild(img);
  messageDiv.appendChild(textDiv);
  messagesDiv.appendChild(messageDiv);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
