
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
