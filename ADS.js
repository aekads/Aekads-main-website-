document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("mainHeader");
  let lastScrollY = window.scrollY;

  // ✅ Locomotive Scroll Init
  const scroll = new LocomotiveScroll({
    el: document.querySelector("#scroll-container"),
    smooth: true,
    lerp: 0.1,
    getDirection: true,
  });

  // ✅ Header Hide/Show on Scroll
  scroll.on("scroll", (obj) => {
    const currentScrollY = obj.scroll.y;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scroll Down
      header.classList.add("-translate-y-full");
      header.classList.remove("translate-y-0");
    } else {
      // Scroll Up
      header.classList.remove("-translate-y-full");
      header.classList.add("translate-y-0");
    }

    lastScrollY = currentScrollY;

    updateActiveLink(currentScrollY); // Also update active nav
  });

  // ✅ Set initial header state
  header.classList.add("translate-y-0");

  // ✅ Animate elements on view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0");
        entry.target.classList.add("animate-fadeUp");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

  // ✅ Update Locomotive after lazy loading
  window.addEventListener("load", () => {
    setTimeout(() => scroll.update(), 500);
  });

  setTimeout(() => scroll.update(), 10000); // Safety update
});

// ✅ Active Link Highlighter
function updateActiveLink(currentScrollY = window.scrollY) {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");
  let currentSection = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      currentScrollY >= sectionTop - 200 &&
      currentScrollY < sectionTop + sectionHeight - 200
    ) {
      currentSection = sectionId;
    }
  });

  if (currentSection) {
    links.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (
        href === `#${currentSection}` ||
        (currentSection === "section-0" && (href === "#" || href === "#section-0"))
      ) {
        link.classList.add("active");
      }
    });
  }
}

// ✅ Dynamic h4 Placeholder Headings
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
    if (container) container.appendChild(h4);
  });
});
