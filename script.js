// Tab Switching Logic
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute("data-tab");

            tabs.forEach(tab => {
                if (tab.id === target) {
                    tab.classList.add("active");
                } else {
                    tab.classList.remove("active");
                }
            });

            // Toggle active class on nav links
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Optional: Scroll to top when switching tab
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});

// Discord Button Function
function openDiscord() {
    window.open("https://discord.gg/YOUR_INVITE_CODE", "_blank");
}

// Copy Loadstring Logic
function copyLoadstring() {
    const loadstringInput = document.getElementById("loadstringInput");
    loadstringInput.select();
    loadstringInput.setSelectionRange(0, 99999); // For mobile support

    navigator.clipboard.writeText(loadstringInput.value)
        .then(() => {
            showCopyFeedback();
        })
        .catch(err => {
            console.error('Copy failed:', err);
        });
}

// Feedback Animation after Copy
function showCopyFeedback() {
    const copyButton = document.querySelector(".copy-btn");
    const originalText = copyButton.textContent;

    copyButton.textContent = "Copied!";
    copyButton.style.background = "#33ffbb";

    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.background = "#00ff99";
    }, 1500);
}
