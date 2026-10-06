/* ==========================================================
   VESKILA — shared script
   ========================================================== */

// Email that receives the contact form (change this one line)
var CONTACT_EMAIL = "hello@veskila.com";

// 1. Image fallbacks: if a file in /images is missing, show a clean placeholder
function handleMissing(img) {
  var kind = img.getAttribute("data-fallback");
  if (kind === "logo") {
    img.hidden = true;
  } else if (kind === "kit") {
    var ph = document.createElement("div");
    ph.className = "ph";
    ph.textContent = "Add images/" + img.getAttribute("src").split("/").pop();
    img.replaceWith(ph);
  }
}
document.querySelectorAll("img[data-fallback]").forEach(function (img) {
  img.addEventListener("error", function () { handleMissing(img); });
  if (img.complete && img.naturalWidth === 0) handleMissing(img);
});

// 2. Footer year
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 3. Contact form (frontend only: opens the visitor's email app, prefilled)
var form = document.getElementById("contact-form");
if (form) {
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Enter your name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."; },
    message: function (v) { return v.trim().length >= 5 ? "" : "Write a short message."; }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    Object.keys(rules).forEach(function (id) {
      var input = form.elements[id];
      var msg = rules[id](input.value);
      document.getElementById(id + "-error").textContent = msg;
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) ok = false;
    });
    if (!ok) return;

    var d = new FormData(form);
    var subject = "VESKILA enquiry: " + d.get("interest");
    var body = "Name: " + d.get("name") + "\nEmail: " + d.get("email") +
               "\nI want to: " + d.get("interest") + "\n\n" + d.get("message");
    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    document.getElementById("form-status").textContent = "Opening your email app. Press send there to finish.";
  });
}
