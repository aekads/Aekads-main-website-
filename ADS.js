// ====================== Dropdown Menu ======================
const moreBtn = document.getElementById("moreBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

if (moreBtn && dropdownMenu) {
  moreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdownMenu.style.opacity === "1";
    isOpen ? closeDropdown() : openDropdown();
  });

  dropdownMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDropdown);
  });

  document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== moreBtn) {
      closeDropdown();
    }
  });

  window.addEventListener("scroll", () => {
    if (dropdownMenu.style.opacity === "1") {
      closeDropdown();
    }
  });
}

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

// ====================== All DOM Related ======================
document.addEventListener("DOMContentLoaded", function () {
  // ========== Quote Popup ==========
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

  document.getElementById("closePopup")?.addEventListener("click", closePopup);

  if (quoteForm) {
    quoteForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitButton = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Submitting...
      `;

      const formData = new FormData(quoteForm);
      const formObject = {};
      formData.forEach((value, key) => (formObject[key] = value));

      try {
        const response = await fetch("https://cms.aekads.com/api/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formObject),
        });

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
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }

  // ========== Highlight Rotation ==========
  const highlights = document.querySelectorAll(".highlight");
  let currentIndex = 0;
  // setInterval(() => {
  //   highlights.forEach((hl) => hl.classList.remove("active"));
  //   currentIndex = (currentIndex + 1) % highlights.length;
  //   highlights[currentIndex].classList.add("active");
  // }, 2500);

  // ========== Slideshow ==========
  const allSlides = document.querySelectorAll(".slide1");
  let current = 0;

  function getVisibleSlides() {
    const isMobile = window.innerWidth <= 700;
    return Array.from(allSlides).filter((slide) =>
      isMobile
        ? slide.classList.contains("mobile-img")
        : slide.classList.contains("desktop-img")
    );
  }

  function showNextSlide() {
    const visibleSlides = getVisibleSlides();
    if (visibleSlides.length === 0) return;
    visibleSlides[current]?.classList.remove("active");
    current = (current + 1) % visibleSlides.length;
    visibleSlides[current]?.classList.add("active");
  }

  function initializeSlideshow() {
    const visibleSlides = getVisibleSlides();
    visibleSlides.forEach((slide, index) => {
      slide.classList.remove("active");
      if (index === 0) slide.classList.add("active");
    });
    current = 0;
  }

  if (allSlides.length > 0) {
    initializeSlideshow();
    setInterval(showNextSlide, 2500);
    window.addEventListener("resize", initializeSlideshow);
  }

  // ========== Mobile Navbar ==========
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");
  const mobileLinks = document.getElementById("mobile-links");
  const mobileCloseIcon = document.getElementById("mobile-close-icon");
  const overlay = document.getElementById("overlay");

  function openMobileMenu() {
    mobileLinks.style.display = "block";
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileLinks.style.display = "none";
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }

  mobileMenuIcon?.addEventListener("click", openMobileMenu);
  mobileCloseIcon?.addEventListener("click", closeMobileMenu);
  overlay?.addEventListener("click", closeMobileMenu);

  mobileLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
});

// ====================== Header Scroll & Active Link ======================
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

function updateActiveLink() {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = rect.height;
    const sectionId = section.getAttribute("id");

    if (
      window.scrollY >= sectionTop - 200 &&
      window.scrollY < sectionTop + sectionHeight - 200
    ) {
      currentSection = sectionId;
    }
  });

  if (currentSection && !navLinksActive) {
    links.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (
        href === `#${currentSection}` ||
        (currentSection === "section-0" &&
          (href === "#" || href === "#section-0"))
      ) {
        link.classList.add("active");
      }
    });
  }
}

window.addEventListener("scroll", () => {
  handleScroll(window.scrollY);
  updateActiveLink();
});



// Locomotive Scroll Init
document.addEventListener("DOMContentLoaded", function () {
  // ✅ 1. Locomotive Scroll Initialization
  const scroll = new LocomotiveScroll({
    el: document.querySelector("#scroll-container"),
    smooth: true,
    lerp: 0.1,
    getDirection: true,
  });

  // ✅ 2. Header Hide/Show on Scroll
  const header = document.querySelector(".header");
  let lastScrollY = 0;

  scroll.on("scroll", (args) => {
    const currentScrollY = args.scroll.y;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down
      header.classList.remove("header-visible");
      header.classList.add("header-hidden");
    } else {
      // Scrolling up
      header.classList.remove("header-hidden");
      header.classList.add("header-visible");
    }

    lastScrollY = currentScrollY;
  });

  // ✅ 3. Make header visible on load
  header.classList.add("header-visible");

  // ✅ 4. Mobile Menu Toggle
  const menuIcon = document.getElementById("mobile-menu-icon");
  const mobileLinks = document.getElementById("mobile-links");
  const overlay = document.getElementById("overlay");

  menuIcon.addEventListener("click", () => {
    mobileLinks.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    mobileLinks.classList.remove("active");
    overlay.classList.remove("active");
  });

  // ✅ 5. Animate Elements When In View
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0");
        entry.target.classList.add("animate-fadeUp");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

  // ✅ 6. Update Locomotive Scroll after lazy images load
  window.addEventListener("load", () => {
    setTimeout(() => scroll.update(), 500);
  });

  // ✅ Optional: Update scroll again after 10s for safety
  setTimeout(() => scroll.update(), 10000);
});


window.addEventListener('DOMContentLoaded', () => {
  const headings = [
    { id: 'h4-placeholder', text: 'Submit Creative' },
    { id: 'h4-placeholder-2', text: 'Select Target' },
    { id: 'h4-placeholder-3', text: 'Publish Campaign' },
    { id: 'h4-placeholder-4', text: 'Proof of Play' },
    { id: 'h4-placeholder-5', text: 'Log Report' },
    { id: 'h4-placeholder-6', text: 'Repeat' }
  ];

  headings.forEach(({ id, text }) => {
    const h4 = document.createElement('h4');
    h4.className = "font-semibold w-full text-center lg:flex bg-gradient-to-r from-[#052652] to-[#2D9CDB] bg-clip-text text-transparent dark:text-white text-[25px] mb-1";
    h4.textContent = text;
    const container = document.getElementById(id);
    if (container) {
      container.appendChild(h4);
    }
  });
});
