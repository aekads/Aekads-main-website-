const moreBtn = document.getElementById("moreBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

// Toggle dropdown on More button click
moreBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Stop bubbling so body click doesn't close it instantly
  const isOpen = dropdownMenu.style.opacity === "1";

  if (isOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
});

document.getElementById("closePopup").addEventListener("click", function() {
  document.getElementById("quotePopup").style.display = "none";
});


// Close dropdown when clicking on a dropdown link
dropdownMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeDropdown();
  });
});

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
  if (!dropdownMenu.contains(e.target) && e.target !== moreBtn) {
    closeDropdown();
  }
});

// Close dropdown when scrolling
window.addEventListener("scroll", () => {
  if (dropdownMenu.style.opacity === "1") {
    closeDropdown();
  }
});

function openDropdown() {
  dropdownMenu.style.opacity = "1";
  dropdownMenu.style.transform = "translateY(0)";

  dropdownMenu.style.pointerEvents = "auto";
}

function closeDropdown() {
  dropdownMenu.style.opacity = "0";
  dropdownMenu.style.transform = "translateY(10px)";
  dropdownMenu.style.pointerEvents = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const quoteButtons = document.querySelectorAll(".ajayy");
  const quotePopup = document.getElementById("quotePopup");
  const popupContent = document.querySelector(".popup-content");
  const quoteForm = document.getElementById("quote-form");

  // Show quote popup after 5 seconds
  setTimeout(() => {
    quotePopup.style.display = "flex";
    document.body.style.overflow = "hidden";
  }, 3000);

  // Attach click to all quote buttons
  quoteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      quotePopup.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  // Close popup when clicking outside
  quotePopup.addEventListener("click", function (e) {
    if (e.target === quotePopup) {
      closePopup();
    }
  });

  popupContent.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Close function
  function closePopup() {
    quotePopup.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Form Submission Handler
  quoteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(quoteForm);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch(
        "https://aekteam.onrender.com/api/send-message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formObject),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Success Handling
      Swal.fire({
        title: "Success!",
        text: "We have received your request for a quote , Our sales representative will contact you soon!",
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
    }
  });

  function closePopup() {
    quotePopup.style.display = "none";
    document.body.style.overflow = "auto";
  }
});


document.addEventListener("DOMContentLoaded", function () {
  // Get all slides (both desktop and mobile)
  const allSlides = document.querySelectorAll(".slide1");
  let current = 0;

  // Function to get only the visible slides (either desktop or mobile based on screen size)
  function getVisibleSlides() {
    const isMobile = window.innerWidth <= 700;
    return Array.from(allSlides).filter((slide) => {
      return isMobile
        ? slide.classList.contains("mobile-img")
        : slide.classList.contains("desktop-img");
    });
  }

  function showNextSlide() {
    const visibleSlides = getVisibleSlides();

    // Hide current slide
    if (visibleSlides[current]) {
      visibleSlides[current].classList.remove("active");
    }

    // Move to next slide
    current = (current + 1) % visibleSlides.length;

    // Show new slide
    visibleSlides[current].classList.add("active");
  }

  // Initialize - show first visible slide
  function initializeSlideshow() {
    const visibleSlides = getVisibleSlides();
    visibleSlides.forEach((slide, index) => {
      slide.classList.remove("active");
      if (index === 0) slide.classList.add("active");
    });
    current = 0;
  }

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeSlideshow();
    }, 200);
  });

  // Start the slideshow
  initializeSlideshow();
  setInterval(showNextSlide, 2500); // Change every 4 seconds
});

let scroll;
let lastScrollY = window.scrollY;
const header = document.querySelector(".header");
let navLinksActive = false;

function handleScroll(currentScrollY) {
  if (!header) return;

  // Header visibility logic
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

function updateActiveLink() {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "";

  // Find which section is currently in view
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = rect.height;
    const sectionId = section.getAttribute("id");

    // Check if section is in view (with some offset)
    if (
      window.scrollY >= sectionTop - 200 &&
      window.scrollY < sectionTop + sectionHeight - 200
    ) {
      currentSection = sectionId;
    }
  });

  // Update active link
  if (currentSection && !navLinksActive) {
    links.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (
        href === `#${currentSection}` ||
        (currentSection === "section-0" && href === "#") ||
        (currentSection === "section-0" && href === "#section-0")
      ) {
        link.classList.add("active");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Locomotive Scroll
  scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    lerp: 0.08,
    offset: [-100, 0],
    getDirection: true,
    repeat: true,
  });

  // Handle scroll events from Locomotive Scroll
  scroll.on("scroll", (args) => {
    handleScroll(args.scroll.y);
    updateActiveLink();
  });

  // Also listen to native scroll for fallback
  window.addEventListener("scroll", () => {
    handleScroll(window.scrollY);
    updateActiveLink();
  });

  // Make first link active on load
  const links = document.querySelectorAll(".nav-links a");
  if (links.length > 0) {
    links[0].classList.add("active");
  }

  // Click event for nav links
  document.querySelectorAll('.nav-links a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      navLinksActive = true;

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      // Update active state
      links.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      // Scroll to target
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        scroll.scrollTo(targetElement);
      }

      // Reset flag after scroll completes
      setTimeout(() => {
        navLinksActive = false;
      }, 1000);
    });
  });

  // MOBILE MENU LOGIC
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");
  const mobileLinks = document.getElementById("mobile-links");
  const overlay = document.getElementById("overlay");

  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      mobileMenuIcon.style.opacity = "0";
      mobileMenuIcon.style.pointerEvents = "none";
    } else {
      mobileMenuIcon.style.opacity = "1";
      mobileMenuIcon.style.pointerEvents = "auto";
    }
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
      const closeBtn = mobileLinks.querySelector(".close-btn");
      if (closeBtn) closeBtn.remove();
      mobileMenuIcon.innerHTML = "&#9776;";
    }
  });

  overlay.addEventListener("click", function () {
    mobileLinks.classList.remove("active");
    overlay.classList.remove("active");
    mobileMenuIcon.innerHTML = "&#9776;";
    const closeBtn = mobileLinks.querySelector(".close-btn");
    if (closeBtn) closeBtn.remove();
  });

  // Smooth scroll for all anchors
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetElement = document.querySelector(this.getAttribute("href"));
      if (targetElement) {
        scroll.scrollTo(targetElement);
      }
      mobileLinks.classList.remove("active");
      overlay.classList.remove("active");
      mobileMenuIcon.innerHTML = "&#9776;";
      const closeBtn = mobileLinks.querySelector(".close-btn");
      if (closeBtn) closeBtn.remove();
    });
  });

  // Scroll animations
  const scrollElements = document.querySelectorAll("[data-scroll]");
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    },
    { threshold: 0.5 }
  );
  scrollElements.forEach((el) => scrollObserver.observe(el));

  // Highlight rotation
  const highlights = document.querySelectorAll(".highlight");
  let currentIndex = 0;
  setInterval(() => {
    highlights.forEach((hl) => hl.classList.remove("active"));
    currentIndex = (currentIndex + 1) % highlights.length;
    highlights[currentIndex].classList.add("active");
  }, 2500);

  // Form validation
  document
    .getElementById("contact-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const emailInput = document.getElementById("email");
      const emailError = document.getElementById("email-error");

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(emailInput.value)) {
        emailError.style.display = "block";
        return;
      } else {
        emailError.style.display = "none";
      }

      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const email = emailInput.value;
      const phone = document.getElementById("phone").value;
      const message = document.getElementById("message").value;

      const formData = { firstName, lastName, email, phone, message };

      try {
        const response = await fetch(
          "https://aekteam.onrender.com/api/send-message",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );

        let result;
        try {
          result = await response.json();
        } catch (error) {
          result = { error: "No response body (possibly due to CORS)" };
        }

        if (response.ok) {
          Swal.fire({
            title: "Success!",
            text: "Thank you for submitting! We'll get back to you soon.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-popup",
              title: "custom-title",
              confirmButton: "custom-button",
            },
          });
          document.getElementById("contact-form").reset();
        } else {
          Swal.fire({
            title: "Failed",
            text: "Failed to send message: " + result.error,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "custom-popup",
              title: "custom-title",
              confirmButton: "custom-button-error",
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error: " + error.message,
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "custom-popup",
            title: "custom-title",
            confirmButton: "custom-button-error",
          },
        });
      }
    });

  // Arrow section toggle
  document.querySelector(".arrow-icon").addEventListener("click", () => {
    const section1 = document.querySelector(".section1");
    const section2 = document.querySelector(".section2");

    scroll.scrollTo(
      window.scrollY < section1.offsetHeight ? section2 : section1,
      {
        offset: 0,
        duration: 1000,
        easing: [0.25, 0.0, 0.35, 1.0],
      }
    );
  });
});
