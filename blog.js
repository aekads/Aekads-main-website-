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
