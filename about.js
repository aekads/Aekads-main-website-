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



// ✅ Timeline Progress Update
function updateTimelineProgress() {
  const progressLine = document.querySelector(".timeline-progress");
  const timeline = document.querySelector(".timeline");
  if (!progressLine || !timeline) return;

  const rect = timeline.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const totalHeight = timeline.offsetHeight;
  let visibleHeight = windowHeight - rect.top;

  visibleHeight = Math.min(Math.max(0, visibleHeight), totalHeight);
  progressLine.style.height = `${visibleHeight}px`;
}

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

      updateTimelineProgress(); // 👈 Timeline update on scroll
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
});


// Dropdown Menu
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
