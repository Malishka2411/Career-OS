/*=================================================
            Career OS AI - MAIN.JS
=================================================*/


/*==========================
STICKY NAVBAR
==========================*/

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.style.background = "rgba(5,8,22,.92)";
        header.style.backdropFilter = "blur(18px)";
        header.style.boxShadow = "0 15px 40px rgba(0,0,0,.35)";

    } else {

        header.style.background = "transparent";
        header.style.boxShadow = "none";

    }

});


/*==========================
SMOOTH SCROLL
==========================*/

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"});

        }

    });

});


/*==========================
FAQ ACCORDION
==========================*/

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        faqItems.forEach(f => {

            if (f!== item) {

                f.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});


/*==========================
SCROLL REVEAL
==========================*/

const reveals = document.querySelectorAll(".feature-card,.step,.module,.dashboard-box,.testimonial-card,.price-card,.stat-box,.contact-info,.contact-form");

function revealAnimation() {

    reveals.forEach(card => {

        const top = card.getBoundingClientRect().top;

        const height = window.innerHeight;

        if (top < height - 120) {

            card.classList.add("fade-up");

        }

    });

}

window.addEventListener("scroll", revealAnimation);

revealAnimation();


/*==========================
COUNTER ANIMATION
==========================*/

const counters = document.querySelectorAll(".stat-box h1");

let started = false;

function startCounters() {

    if (started) return;

    const section = document.querySelector(".stats");

    if (!section) return;

    if (window.scrollY > section.offsetTop - 500) {

        counters.forEach(counter => {

            const target = parseInt(counter.innerText);

            let count = 0;

            const speed = target / 80;

            const update = () => {

                count += speed;

                if (count < target) {

                    counter.innerText = Math.floor(count) + "+";

                    requestAnimationFrame(update);

                } else {

                    if (counter.innerText.includes("%")) {

                        counter.innerText = target + "%";

                    } else {

                        counter.innerText = target + "+";

                    }

                }

            };

            update();

        });

        started = true;

    }

}

window.addEventListener("scroll", startCounters);


/*==========================
BACK TO TOP
==========================*/

const topBtn = document.createElement("div");

topBtn.className = "top-btn";

topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topBtn.classList.add("show");

    } else {

        topBtn.classList.remove("show");

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"});

});


/*==========================
ACTIVE NAVBAR LINK
==========================*/

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});


/*==========================
FLOATING DASHBOARD
==========================*/

const dashboard = document.querySelector(".dashboard");

window.addEventListener("mousemove", e => {

    if (!dashboard) return;

    const x = (window.innerWidth / 2 - e.pageX) / 40;

    const y = (window.innerHeight / 2 - e.pageY) / 40;

    dashboard.style.transform =`rotateY(${x}deg) rotateX(${-y}deg)`;

});


/*==========================
BUTTON RIPPLE
==========================*/

const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {

    btn.addEventListener("click", function (e) {

        const circle = document.createElement("span");

        const size = Math.max(this.clientWidth, this.clientHeight);

        circle.style.width = size + "px";

        circle.style.height = size + "px";

        circle.style.left =

            e.clientX - this.offsetLeft - size / 2 + "px";

        circle.style.top =

            e.clientY - this.offsetTop - size / 2 + "px";

        circle.classList.add("ripple");

        this.appendChild(circle);

        setTimeout(() => {

            circle.remove();

        }, 700);

    });

});


/*==========================
PRELOADER
==========================*/

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (loader) {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 500);

    }

});


/*==========================
CURRENT YEAR
==========================*/

const year = document.querySelector("#year");

if (year) {

    year.textContent = new Date().getFullYear();

}


console.log(" Career OS AI Loaded Successfully");


/*==========================
MOBILE NAV TOGGLE (responsive)
==========================*/

const navToggle = document.getElementById("navToggle");
const navLinksContainer = document.getElementById("navLinks");

if (navToggle && navLinksContainer) {

    navToggle.addEventListener("click", () => {

        const isOpen = navLinksContainer.classList.toggle("active");
        navToggle.classList.toggle("active");
        navToggle.setAttribute("aria-expanded", isOpen? "true": "false");

        const icon = navToggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });

    // Close the mobile menu when a nav link is tapped
    navLinksContainer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinksContainer.classList.remove("active");
            navToggle.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            const icon = navToggle.querySelector("i");
            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-xmark");
            }
        });
    });
}
