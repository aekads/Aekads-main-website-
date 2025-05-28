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



document.addEventListener('DOMContentLoaded', function () {
    // API Configuration
    const API_BASE_URL = 'https://cms.aekads.com/api';
    let allPosts = [];

    // DOM Elements
    const blogPostsContainer = document.getElementById('blogPostsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const blogDetailContainer = document.getElementById('blogDetailContainer');
    const backButton = document.getElementById('backButton');

    // Core Functions
    async function fetchAllBlogPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/Aekadsblog`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            return await response.json();
        } catch (error) {
            showError('Failed to load posts. Please try again later.');
            return [];
        }
    }

    async function fetchBlogPostById(postId) {
        try {
            const response = await fetch(`${API_BASE_URL}/Aekadsblog/${postId}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            return await response.json();
        } catch (error) {
            showError('Failed to load post details.');
            return null;
        }
    }

    // Blog List Rendering
    async function renderBlogPosts() {
        showLoading();
        try {
            if (allPosts.length === 0) allPosts = await fetchAllBlogPosts();

            blogPostsContainer.innerHTML = allPosts
                .map((post, index) => createPostHTML(post, index === 0))
                .join('');

            addPostEventListeners();
        } catch (error) {
            showError('Error loading posts.');
        } finally {
            hideLoading();
        }
    }

    function createPostHTML(post, isFeatured) {
        return `
            <div class="${isFeatured ? 'featured-post' : 'blog-card'}">
                <div class="blog-card-img-container">
                    <img src="${post.image_url}" alt="${post.title}" class="blog-card-img" loading="lazy">
                </div>
                <div class="blog-card-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.short_description}</p>
                    <a href="#" class="read-more view-post-btn" data-post-id="${post.id}">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // Blog Detail Handling
    async function showBlogDetail(postId) {
        try {
            document.querySelector('main').style.display = 'none';
            blogDetailContainer.style.display = 'block';

            // Show loading state
            document.getElementById('detailContent').innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Loading post content...</p>
                </div>
            `;

            const post = await fetchBlogPostById(postId);
            if (!post) return;

            // Update content
            document.title = `${post.title} | AekAds Blog`;
            document.getElementById('detailTitle').textContent = post.title;

            // Set image
            const detailImage = document.getElementById('detailImage');
            detailImage.src = post.image_url;
            detailImage.alt = post.title;

            // Load content
            document.getElementById('detailContent').innerHTML = post.description;

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            document.getElementById('detailContent').innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Post</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    // Event Handlers
    function addPostEventListeners() {
        document.querySelectorAll('.view-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = btn.dataset.postId;
                showBlogDetail(postId);
                history.pushState({ postId }, '', `?id=${postId}`);
            });
        });
    }

    // Consolidated back button handler
    backButton.addEventListener('click', () => {
        blogDetailContainer.style.display = 'none';
        document.querySelector('main').style.display = 'block';
        history.replaceState(null, '', window.location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (postId) {
            showBlogDetail(postId);
        } else {
            blogDetailContainer.style.display = 'none';
            document.querySelector('main').style.display = 'block';
            document.title = "AEKADS Blog - Digital Advertising & Technology Insights";
        }
    });

    // Initial Load
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (postId) {
        showBlogDetail(postId);
    } else {
        renderBlogPosts();
    }

    // Utility Functions
    function showLoading() {
        loadingSpinner.style.display = 'block';
        blogPostsContainer.innerHTML = '';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
    }

    function showError(message) {
        blogPostsContainer.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
});

document.getElementById('feedbackForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email1').value;
    const comments = document.getElementById('comments').value;


    console.log('📩 Form Data:', { name, email1, comments });

    console.log(document.getElementById('email1'));

    console.log(document.getElementById('email1').value);


    const requestConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, comments })
    };

    console.log('📤 Fetch Request Config:', requestConfig);

    try {
        const response = await fetch('https://cms.aekads.com/api/submit-feedback', requestConfig);

        console.log('📥 Response Object:', response);
        console.log('✅ Response Status:', response.status);
        console.log('📝 Response Headers:', [...response.headers.entries()]);
        console.log('📄 Response Content-Type:', response.headers.get('Content-Type'));

        const responseText = await response.text();
        console.log('📝 Full Response Text:', responseText);

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Feedback Submitted',
                text: 'Your feedback has been submitted successfully!',
            });
        } else {
            console.error('❌ Failed Response:', response);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an error submitting your feedback. Please try again.',
            });
        }

    } catch (error) {
        console.error('🚨 Request Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error with the request. Please try again later.',
        });
    }
});
