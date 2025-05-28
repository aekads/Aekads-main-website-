// Header Scroll and Active Links
let scroll;
let lastScrollY = window.scrollY;
const header = document.querySelector(".header");
let navLinksActive = false;

function handleScroll(currentScrollY) {
  if (!header) return;

  if (currentScrollY <= 0) {
    header.classList.remove("header-hidden");
    header.classList.add("header-visible");
    return;
  }

  if (Math.abs(currentScrollY - lastScrollY) < 5) return;

  if (currentScrollY > lastScrollY) {
    header.classList.remove("header-visible");
    header.classList.add("header-hidden");
  } else {
    header.classList.remove("header-hidden");
    header.classList.add("header-visible");
  }

  lastScrollY = currentScrollY;
}

// Quote Popup
document.addEventListener("DOMContentLoaded", function () {
    const quoteButtons = document.querySelectorAll(".ajayy");
    const quotePopup = document.getElementById("quotePopup");
    const popupContent = document.querySelector(".popup-content");
    const quoteForm = document.getElementById("quote-form");
  
    function openPopup() {
      quotePopup.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  
    function closePopup() {
      quotePopup.style.display = "none";
      document.body.style.overflow = "auto";
    }
  
    if (quotePopup) {
      setTimeout(openPopup, 5000);
  
      quotePopup.addEventListener("click", function (e) {
        if (e.target === quotePopup) closePopup();
      });
  
      quoteButtons.forEach((button) => {
        button.addEventListener("click", openPopup);
      });
    }
  
    popupContent?.addEventListener("click", (e) => e.stopPropagation());
  
    // Highlight rotation
    const highlights = document.querySelectorAll(".highlight");
    let currentIndex = 0;
    setInterval(() => {
      highlights.forEach((hl) => hl.classList.remove("active"));
      currentIndex = (currentIndex + 1) % highlights.length;
      highlights[currentIndex].classList.add("active");
    }, 2500);
  
    document.getElementById("closePopup")?.addEventListener("click", closePopup);
  
    if (quoteForm) {
      quoteForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        // Get the submit button
        const submitButton = quoteForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Add loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Submitting...
        `;
        
        const formData = new FormData(quoteForm);
        const formObject = {};
        formData.forEach((value, key) => (formObject[key] = value));
  
        try {
          const response = await fetch(
            "https://cms.aekads.com/api/send-message",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formObject),
            }
          );
  
          if (!response.ok) throw new Error(`Server error: ${response.status}`);
  
          Swal.fire({
            title: "Success!",
            text: "We have received your request for a quote. Our sales representative will contact you soon!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-popup",
              title: "custom-title",
              confirmButton: "custom-button",
            },
          });
  
          closePopup();
          quoteForm.reset();
        } catch (error) {
          console.error("Submission error:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to send message. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-popup",
              title: "custom-title",
              confirmButton: "custom-button-error",
            },
          });
        } finally {
          // Restore button to original state
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    }
  });

// Locomotive Scroll Init
document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector("[data-scroll-container]");
  if (scrollContainer) {
    scroll = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.08, 
      getDirection: true,
      repeat: true,
    });

    scroll.on("scroll", (args) => {
      handleScroll(args.scroll.y);
    });

    setTimeout(() => scroll.update(), 1000);
  }

  const links = document.querySelectorAll(".nav-links a");
  if (links.length > 0) {
    links[0].classList.add("active");
  }

  document.querySelectorAll('.nav-links a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      navLinksActive = true;

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      links.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      const targetElement = document.querySelector(targetId);
      if (targetElement && scroll) {
        scroll.scrollTo(targetElement);
      }

      setTimeout(() => {
        navLinksActive = false;
      }, 1000);
    });
  });

  // Mobile Menu
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");
  const mobileLinks = document.getElementById("mobile-links");
  const overlay = document.getElementById("overlay");

  if (mobileMenuIcon && mobileLinks && overlay) {
    let lastScrollTop = 0;

    scroll.on("scroll", function (args) {
      const scrollTop = args.scroll.y;
      mobileMenuIcon.style.opacity = scrollTop > lastScrollTop ? "0" : "1";
      mobileMenuIcon.style.pointerEvents =
        scrollTop > lastScrollTop ? "none" : "auto";
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    function createCloseButton() {
      const closeBtn = document.createElement("button");
      closeBtn.className = "close-btn";
      closeBtn.innerHTML = "&#10005;";
      closeBtn.addEventListener("click", function () {
        mobileLinks.classList.remove("active");
        overlay.classList.remove("active");
        mobileMenuIcon.innerHTML = "&#9776;";
        closeBtn.remove();
      });
      return closeBtn;
    }

    mobileMenuIcon.addEventListener("click", function () {
      mobileLinks.classList.toggle("active");
      overlay.classList.toggle("active");

      if (mobileLinks.classList.contains("active")) {
        const closeBtn = createCloseButton();
        mobileLinks.appendChild(closeBtn);
        mobileMenuIcon.innerHTML = "&#10005;";
      } else {
        mobileLinks.querySelector(".close-btn")?.remove();
        mobileMenuIcon.innerHTML = "&#9776;";
      }
    });

    overlay.addEventListener("click", function () {
      mobileLinks.classList.remove("active");
      overlay.classList.remove("active");
      mobileMenuIcon.innerHTML = "&#9776;";
      mobileLinks.querySelector(".close-btn")?.remove();
    });
  }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && scroll) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        scroll.scrollTo(target, {
          offset: 0, // Adjust this value as needed
          duration: 800,
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      }
    }
  });
});

// Update scroll when content changes
function updateScroll() {
  scroll.update();
}

// Function to scroll to top
function scrollToTop() {
  if (scroll) {
    scroll.scrollTo("top", {
      duration: 0,
      disableLerp: true,
    });
  } else {
    window.scrollTo(0, 0);
  }
}



document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');

        // Close all answers first
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('show');
        });

        // Open clicked one if it wasn't active
        if (!isActive) {
            question.classList.add('active');
            answer.classList.add('show');
        }
    });
});

// Add subtle animation to FAQ items on load
document.querySelectorAll('.faq-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
});