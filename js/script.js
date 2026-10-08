/* ICT251 Activity 3 - Priscila Namusokwe
   Features:
   1. Contact form validation and preview (compulsory)
   2. Gallery viewer (Previous / Next)
   3. Project search and filter
   4. Mobile navigation menu */

/* =====================================================
   1. CONTACT FORM VALIDATION AND PREVIEW
===================================================== */
const form = document.getElementById("contact-form");
const summaryBox = document.getElementById("form-summary");

// Show (or clear) an error message beside one field
function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  document.getElementById(fieldId + "-error").textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

// Return true when the text looks like name@domain.ext
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Check name, email and message; show errors; return true if all are valid
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  let valid = true;
  let firstInvalid = null;

  if (name === "") {
    setError("name", "Please enter your name (spaces alone are not accepted).");
    valid = false;
    firstInvalid = firstInvalid || "name";
  } else {
    setError("name", "");
  }

  if (email === "") {
    setError("email", "Please enter your email address.");
    valid = false;
    firstInvalid = firstInvalid || "email";
  } else if (!isValidEmail(email)) {
    setError("email", "Enter a valid email such as name@example.com.");
    valid = false;
    firstInvalid = firstInvalid || "email";
  } else {
    setError("email", "");
  }

  if (message === "") {
    setError("message", "Please enter a message (spaces alone are not accepted).");
    valid = false;
    firstInvalid = firstInvalid || "message";
  } else {
    setError("message", "");
  }

  if (firstInvalid) {
    document.getElementById(firstInvalid).focus();
  }
  return valid;
}

// Build the preview with textContent so user text is never treated as HTML
function showSummary(name, email, topic, message) {
  summaryBox.textContent = "";

  const heading = document.createElement("strong");
  heading.textContent = "Form data validated successfully. No message was sent.";
  summaryBox.appendChild(heading);

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Topic", topic || "Not selected"],
    ["Message", message]
  ];
  rows.forEach(function (row) {
    const p = document.createElement("p");
    p.textContent = row[0] + ": " + row[1];
    summaryBox.appendChild(p);
  });
  summaryBox.hidden = false;
}

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // keep everything local, no page reload
    summaryBox.hidden = true;
    if (validateForm()) {
      showSummary(
        document.getElementById("name").value.trim(),
        document.getElementById("email").value.trim(),
        document.getElementById("topic").value,
        document.getElementById("message").value.trim()
      );
    }
  });
}

/* =====================================================
   2. GALLERY VIEWER
===================================================== */
// The three photos from Activity 2, with alt text and captions
const photos = [
  {
    src: "images/IMG-20251123-WA0154.jpg",
    alt: "Priscila smiling, standing under a green tree beside a white building, wearing a peach blouse and black skirt",
    caption: "My learning journey and personal development."
  },
  {
    src: "images/IMG-20260914-WA0055.jpg",
    alt: "Priscila smiling outdoors on campus in a black top and grey trousers, with trees behind her",
    caption: "One of my favourite hobbies."
  },
  {
    src: "images/IMG-20260919-WA0009.jpg",
    alt: "Priscila with long braids in a floral dress, looking back over her shoulder beside a brick wall and trees",
    caption: "Exploring technology and web programming."
  }
];

let currentPhoto = 0; // index of the photo being shown

const viewerImg = document.getElementById("viewer-img");
const viewerCaption = document.getElementById("viewer-caption");
const photoCounter = document.getElementById("photo-counter");
const prevButton = document.getElementById("prev-photo");
const nextButton = document.getElementById("next-photo");

// Display the current photo, caption and counter; disable buttons at the ends
function showPhoto() {
  const photo = photos[currentPhoto];
  viewerImg.src = photo.src;
  viewerImg.alt = photo.alt;
  viewerCaption.textContent = photo.caption;
  photoCounter.textContent = "Photo " + (currentPhoto + 1) + " of " + photos.length;
  prevButton.disabled = currentPhoto === 0;
  nextButton.disabled = currentPhoto === photos.length - 1;
}

if (viewerImg) {
  prevButton.addEventListener("click", function () {
    if (currentPhoto > 0) {
      currentPhoto--;
      showPhoto();
    }
  });
  nextButton.addEventListener("click", function () {
    if (currentPhoto < photos.length - 1) {
      currentPhoto++;
      showPhoto();
    }
  });
  showPhoto();
}

/* =====================================================
   3. PROJECT SEARCH AND FILTER
===================================================== */
const searchInput = document.getElementById("project-search");
const resetButton = document.getElementById("project-reset");
const filterMessage = document.getElementById("filter-message");
const projectCards = document.querySelectorAll("#project-grid .project-card");

// Show only the project cards that contain the search text
function filterProjects() {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;

  projectCards.forEach(function (card) {
    const matches = card.textContent.toLowerCase().includes(term);
    card.hidden = !matches;
    if (matches) {
      visible++;
    }
  });

  if (visible === 0) {
    filterMessage.textContent =
      "No projects match \"" + searchInput.value.trim() + "\". Try another word or press Reset.";
  } else if (term === "") {
    filterMessage.textContent = "";
  } else {
    filterMessage.textContent = "Showing " + visible + " of " + projectCards.length + " projects.";
  }
}

if (searchInput) {
  searchInput.addEventListener("input", filterProjects);
  resetButton.addEventListener("click", function () {
    searchInput.value = "";
    filterProjects();
    searchInput.focus();
  });
}

/* =====================================================
   4. MOBILE NAVIGATION
===================================================== */
const navBar = document.getElementById("site-nav");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

// Open or close the menu and keep the button state and label in sync
function setMenu(open) {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
}

if (navToggle) {
  navBar.classList.add("js-nav"); // menu collapses only when JavaScript works
  navToggle.hidden = false;

  navToggle.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("open"));
  });

  // Close the menu after choosing a link
  navLinks.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      setMenu(false);
    }
  });

  // Escape closes the menu and returns focus to the button
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      setMenu(false);
      navToggle.focus();
    }
  });
}
