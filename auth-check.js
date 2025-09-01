// Ye script sabhi restricted pages me include karo
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = localStorage.getItem("userEmail");
    const authToken = localStorage.getItem("authToken");

    // ✅ Agar user login nahi hai toh redirect to login page
    if (!user && !userEmail && !authToken) {
        window.location.href = "/login.html";
    }
});