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

// API Base URL
const API_BASE_URL = "https://cms.aekads.com/api";

// DOM Elements
const jobListings = document.getElementById("job-listings");
const applyModal = document.getElementById("applyModal");

// Function to fetch all jobs
async function fetchAllJobs() {
  try {
    const response = await fetch(`https://cms.aekads.com/api/Aekadsjobs`);
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    showError("Failed to load job listings. Please try again later.");
    return [];
  }
}

// Function to fetch job by ID
async function fetchJobById(jobId) {
  try {
    const response = await fetch(
      `https://cms.aekads.com/api/Aekadsjobs/${jobId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch job details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching job details:", error);
    showError("Failed to load job details. Please try again later.");
    return null;
  }
}

// Function to render job listings
async function renderJobs() {
  // Show loading state
  jobListings.innerHTML = `
<div class="loading-spinner">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`;

  const jobs = await fetchAllJobs();

  if (jobs.length === 0) {
    jobListings.innerHTML = `
  <div class="col-12">
    <div class="alert alert-info">No job openings currently available. Please check back later.</div>
  </div>
`;
    return;
  }

  jobListings.innerHTML = "";

  jobs.forEach((job) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.setAttribute("data-scroll", "");
    col.innerHTML = `
<div class="career-card animate__animated animate__fadeIn">
    <h3 class="job-title">${job.title}</h3>
    <div class="job-meta">
        <span class="job-meta-item"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
        <span class="job-meta-item"><i class="fas fa-clock"></i> ${job.work_type}</span>
    </div>
    <p class="job-description">${job.short_description}</p>
    <button class="btn btn-view-more" data-job-id="${job.id}">
        View Details <i class="fas fa-chevron-right ms-2"></i>
    </button>
</div>`;
    jobListings.appendChild(col);
  });

  // Add event listeners to view more buttons
  document.querySelectorAll(".btn-view-more").forEach((btn) => {
    btn.addEventListener("click", async function (e) {
      e.preventDefault();
      const jobId = this.getAttribute("data-job-id");
      await showJobDetail(jobId);
    });
  });

  // Update scroll after content loads
  updateScroll();
}

// Fixed showJobDetail function
async function showJobDetail(jobId) {
  try {
    // Show loading state
    const detailPage = document.getElementById("job-detail-page");
    detailPage.innerHTML = `
<div class="loading-spinner">
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>
`;
    detailPage.classList.remove("hidden");
    document.querySelector("main").classList.add("hidden");

    // Scroll to top immediately
    scrollToTop();

    // Fetch job details
    const job = await fetchJobById(jobId);
    if (!job) return;

    detailPage.innerHTML = `
    <div class="job-detail-card" data-scroll>
      <style>
        .job-detail-card p {
          color: #363636 !important;
          font-weight: 600 !important;
        }
      </style>
      <a href="career.html" class="btn btn-link mt-3">← Back to all jobs</a>
      <h2 id="detail-job-title" class="job-title">${job.title}</h2>
      <div class="job-meta">
        <span class="job-meta-item"><i class="fas fa-map-marker-alt"></i> 
          <span id="detail-job-location">${job.location}</span>
        </span>
        <span class="job-meta-item"><i class="fas fa-clock"></i> 
          <span id="detail-job-type">${job.work_type}</span>
        </span>
      </div>
      <div id="detail-job-description" class="job-description">
        ${job.description}
      </div>
      <button class="btn btn-apply" id="detail-apply-btn" 
        data-bs-toggle="modal" data-bs-target="#applyModal"
        data-title="${job.title}">
        Apply Now <i class="fas fa-arrow-right ms-2"></i>
      </button>
    </div>
    `;
    

    // Update URL
    history.pushState(null, "", `?jobId=${jobId}`);

    // Update scroll after content loads
    updateScroll();

    // Scroll to top again after content is loaded
    setTimeout(() => {
      scrollToTop();
    }, 100);
  } catch (error) {
    console.error("Error showing job detail:", error);
    detailPage.innerHTML = `
<div class="error-message">
<i class="fas fa-exclamation-circle me-2"></i>
Failed to load job details. Please try again later.
</div>
`;
  }
}

// Function to show error message
function showError(message) {
  jobListings.innerHTML = `
<div class="col-12">
  <div class="error-message">
    <i class="fas fa-exclamation-circle me-2"></i>${message}
  </div>
</div>
`;
}

// Set job title in modal when apply button is clicked
applyModal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  const jobTitle = button.getAttribute("data-title");
  document.getElementById("jobTitleInput").textContent = jobTitle;
  document.getElementById("appliedJobTitle").value = jobTitle;
});

// Initialize job listings
renderJobs();

// Check if we're showing a specific job (for when coming from URL)
const urlParams = new URLSearchParams(window.location.search);
const jobIdParam = urlParams.get("jobId");
if (jobIdParam) {
  showJobDetail(parseInt(jobIdParam));
}

// Handle back/forward navigation
window.addEventListener("popstate", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get("jobId");

  if (jobIdParam) {
    showJobDetail(jobIdParam);
  } else {
    document.getElementById("job-detail-page").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    updateScroll();
    scrollToTop();
  }
});

// Initialize page
document.addEventListener("DOMContentLoaded", async function () {
  // Check if we're showing a specific job (for when coming from URL)
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get("jobId");

  if (jobIdParam) {
    await showJobDetail(jobIdParam);
  } else {
    await renderJobs();
  }
});

const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log("formData", formData);

  // Show submitting alert
  Swal.fire({
    title: "Submitting...",
    text: "Please wait while we upload your application.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const res = await fetch("https://cms.aekads.com/upload-to-drive", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Upload Successful!",
        text: "Your application has been submitted successfully.",
        confirmButtonText: "OK",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          confirmButton: "custom-button",
        },
      });
      form.reset();
    } else {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: data.message || "Something went wrong while uploading.",
        confirmButtonText: "OK",
        customClass: {
          popup: "custom-popup",
          title: "custom-title",
          confirmButton: "custom-button-error",
        },
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "An error occurred while uploading. Please try again.",
      confirmButtonText: "OK",
    });
  }
});
