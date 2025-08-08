document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // --- Text Animation for Home Page ---
  const animatedTextElement = document.getElementById("animated-text");
  const roles = ["Front-End Developer", "UI/UX Designer", "Web Developer"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenRoles = 1500;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      animatedTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      animatedTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentTypingSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      currentTypingSpeed = delayBetweenRoles;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      currentTypingSpeed = typingSpeed;
    }

    setTimeout(typeEffect, currentTypingSpeed);
  }

  if (animatedTextElement) {
    setTimeout(typeEffect, delayBetweenRoles);
  }

  // --- Section Scroll Animations (Intersection Observer) ---
  const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of the element must be visible to trigger
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        // observer.unobserve(entry.target); // Uncomment to animate only once
      } else {
        // entry.target.classList.remove('is-in-view'); // Uncomment to reset animation on scroll out
      }
    });
  }, observerOptions);

  // Select all elements that have animation classes
  document
    .querySelectorAll(
      ".animate-from-left, .animate-from-right, .animate-fade-in"
    )
    .forEach((element) => {
      sectionObserver.observe(element);
    });

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById("main-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        // Adjust this value as needed
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    });
  }
});

const scriptURL = "https://script.google.com/macros/s/AKfycbxP8lbhLrK1ibN1c2r8vC_1rgc2KcktfmrMQg51BJys96A3_YwLVgFw4Ujc-F4sRJBM/exec";

const form = document.forms["google-sheet"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) =>
      alert("Thanks for Contacting us..! We Will Contact You Soon...")
    )
    .catch((error) => console.error("Error!", error.message));
});
