<script>
// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Login function
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('register-section').style.display = 'none';
            document.getElementById('chat-section').style.display = 'block';
            loadMessages();
        })
        .catch(error => {
            alert(error.message);
        });
}

// Register function
function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert('User registered successfully!');
        })
        .catch(error => {
            alert(error.message);
        });
}

// Logout function
function logout() {
    auth.signOut()
        .then(() => {
            document.getElementById('login-section').style.display = 'block';
            document.getElementById('register-section').style.display = 'block';
            document.getElementById('chat-section').style.display = 'none';
        })
        .catch(error => {
            alert(error.message);
        });
}

// Send message function
function sendMessage() {
    const message = document.getElementById('message-input').value;

    if (message.trim() !== '') {
        const currentUser = auth.currentUser;
        const messageData = {
            sender: currentUser.email,
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        database.ref('messages').push(messageData)
            .then(() => {
                document.getElementById('message-input').value = '';
            })
            .catch(error => {
                alert(error.message);
            });
    }
}

// Load messages function
function loadMessages() {
    const chatMessages = document.getElementById('chat-messages');
    database.ref('messages').on('child_added', snapshot => {
        const message = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.innerText = `${message.sender}: ${message.message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Authentication state observer
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
        loadMessages();
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'block';
        document.getElementById('chat-section').style.display = 'none';
    }
});
</script>