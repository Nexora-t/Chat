import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const imageUpload = document.getElementById("image-upload");
const clearMessagesButton = document.getElementById("clear-messages");

// بيانات المستخدم
let username = "";
let profilePicture = "";

// تسجيل الدخول
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  username = document.getElementById("login-username").value.trim();
  const file = profilePictureInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePicture = reader.result;
      startChat();
    };
    reader.readAsDataURL(file);
  } else {
    profilePicture = "https://via.placeholder.com/40"; // صورة افتراضية
    startChat();
  }
});

function startChat() {
  // إخفاء شاشة تسجيل الدخول وإظهار شاشة الدردشة
  loginScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
}

// إرسال رسالة
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  const file = imageUpload.files[0];

  if (message || file) {
    const messageData = {
      username,
      message: message || null,
      profilePicture,
      timestamp: Date.now(),
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        messageData.image = reader.result;
        push(messagesRef, messageData);
      };
      reader.readAsDataURL(file);
    } else {
      push(messagesRef, messageData);
    }

    messageInput.value = "";
    imageUpload.value = "";
  }
});

// عرض الرسائل
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  displayMessage(data, snapshot.key);
});

// حذف الرسائل
clearMessagesButton.addEventListener("click", () => {
  remove(messagesRef)
    .then(() => {
      messagesDiv.innerHTML = ""; // مسح الرسائل من الواجهة
    })
    .catch((error) => {
      console.error("خطأ أثناء مسح الرسائل:", error);
    });
});

// وظيفة عرض الرسائل
function displayMessage(data, key) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  const img = document.createElement("img");
  img.src = data.profilePicture || "https://via.placeholder.com/40";
  img.alt = data.username;

  const textDiv = document.createElement("div");
  textDiv.innerHTML = `<strong>${data.username}:</strong> ${data.message || ""}`;

  if (data.image) {
    const imageElement = document.createElement("img");
    imageElement.src = data.image;
    imageElement.alt = "صورة مرفقة";
    imageElement.classList.add("chat-image");
    textDiv.appendChild(imageElement);
  }

  messageDiv.appendChild(img);
  messageDiv.appendChild(textDiv);
  messagesDiv.appendChild(messageDiv);

  messagesDiv.scrollTop = messagesDiv.scrollHeight; // التمرير التلقائي للأسفل
}
