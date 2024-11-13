import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("error");

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/consulta.html";
    } catch (error) {
        console.error("Erro:", error);
        errorDiv.textContent = "Email ou senha inválidos";
        errorDiv.style.display = "block";
    }
});