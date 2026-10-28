const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");

if (year) {
    year.textContent = String(new Date().getFullYear());
}

if (menuToggle && navLinks) {
    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        navLinks.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuToggle.focus();
        }
    });
}

const contactForm = document.querySelector("#contact-form");

if (contactForm instanceof HTMLFormElement) {
    const formStatus = document.querySelector("#contact-form-status");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!(formStatus instanceof HTMLElement) || !(submitButton instanceof HTMLButtonElement)) {
            throw new Error("The contact form is missing its status or submit button.");
        }

        formStatus.classList.remove("is-error", "is-success");
        formStatus.textContent = "";

        const endpoint = contactForm.getAttribute("action")?.trim() ?? "";

        if (!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint)) {
            formStatus.classList.add("is-error");
            formStatus.textContent = "The contact form isn’t connected yet. Add your Formspree form endpoint to enable message delivery.";
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Formspree could not send your message (HTTP ${response.status}). Please try again or email Debbie directly.`);
            }

            contactForm.reset();
            formStatus.classList.add("is-success");
            formStatus.textContent = "Thanks for reaching out! Your message has been sent.";
        } catch (error) {
            formStatus.classList.add("is-error");
            formStatus.textContent = error instanceof Error
                ? error.message
                : "We couldn’t send your message. Please try again or email Debbie directly.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send message ↗";
        }
    });
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}