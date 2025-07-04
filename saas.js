// /animation

    document.addEventListener("DOMContentLoaded", function () {
            const scroll = new LocomotiveScroll({
                el: document.querySelector("#scroll-container"),
                smooth: true,
                lerp: 0.1,
                getDirection: true
            });
        });


// navbar
        document.addEventListener("DOMContentLoaded", function () {
            const menuIcon = document.getElementById("mobile-menu-icon");
            const mobileLinks = document.getElementById("mobile-links");
            const overlay = document.getElementById("overlay");
            const closeBtn = document.getElementById("mobile-close"); // ✅ Add this line

            // Toggle menu open/close
            menuIcon.addEventListener("click", () => {
                mobileLinks.classList.toggle("active");
                overlay.classList.toggle("active");
            });

            // Close menu when clicking overlay
            overlay.addEventListener("click", () => {
                mobileLinks.classList.remove("active");
                overlay.classList.remove("active");
            });

            // ✅ Close menu when clicking the close button
            closeBtn.addEventListener("click", () => {
                mobileLinks.classList.remove("active");
                overlay.classList.remove("active");
            });
        });

    // <!-- Delayed Text Animation -->
   
        document.addEventListener("DOMContentLoaded", function () {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("opacity-0");
                        entry.target.classList.add("animate-fadeUp");
                        observer.unobserve(entry.target); // Remove this if you want it to re-animate on scroll back
                    }
                });
            }, {
                threshold: 0.2 // Trigger when 20% of the element is visible
            });

            document.querySelectorAll('[data-animate]').forEach(el => {
                observer.observe(el);
            });
        });

    document.addEventListener("DOMContentLoaded", function () {
            const header = document.querySelector(".header");
            let lastScrollY = 0;

            // Locomotive Scroll setup
            const scrollContainer = document.querySelector("[data-scroll-container]");
            const scroll = new LocomotiveScroll({
                el: scrollContainer,
                smooth: true,
                lerp: 0.1,
                getDirection: true,
                repeat: true,
            });

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

            // Make header visible on load
            header.classList.add("header-visible");

            setTimeout(() => scroll.update(), 10000); // for refresh layout
        });
