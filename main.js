/* ============================================================
   Hexagon Finance — Interactions
   ============================================================ */
(function () {
  "use strict";
 
  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (pre) setTimeout(function () { pre.classList.add("hidden"); }, 500);
  });
 
  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
 
  /* ---------- Dark mode ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;
  var stored = localStorage.getItem("hex-theme");
  if (stored === "dark" || (!stored && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.setAttribute("data-theme", "dark");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) { root.removeAttribute("data-theme"); localStorage.setItem("hex-theme", "light"); }
      else { root.setAttribute("data-theme", "dark"); localStorage.setItem("hex-theme", "dark"); }
    });
  }
 
  /* ---------- Sticky navbar ---------- */
  var navbar = document.getElementById("navbar");
  var backTop = document.getElementById("backTop");
  function onScroll() {
    var y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 30);
    if (backTop) backTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
 
  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      hamburger.classList.toggle("active", open);
      hamburger.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }
 
  /* ---------- Mobile dropdown ---------- */
  var dd = document.querySelector(".nav-dropdown");
  var ddToggle = document.querySelector(".nav-dropdown-toggle");
  if (dd && ddToggle) {
    ddToggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 760) { e.preventDefault(); dd.classList.toggle("open"); }
    });
  }
 
  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }
 
  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1800, start = 0, t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animateCounter);
  }
 
  /* ---------- Loan calculator ---------- */
  var amount = document.getElementById("amount");
  var period = document.getElementById("period");
  var amountOut = document.getElementById("amountOut");
  var periodOut = document.getElementById("periodOut");
  var monthlyEl = document.getElementById("monthly");
  var totalEl = document.getElementById("total");
  var MONTHLY_RATE = 0.015;
 
  function fmt(n) { return "UGX " + Math.round(n).toLocaleString(); }
  function calc() {
    if (!amount || !period) return;
    var P = parseFloat(amount.value);
    var n = parseFloat(period.value);
    var r = MONTHLY_RATE;
    // amortized monthly payment
    var monthly = (P * r) / (1 - Math.pow(1 + r, -n));
    var total = monthly * n;
    amountOut.textContent = P.toLocaleString();
    periodOut.textContent = n;
    monthlyEl.textContent = fmt(monthly);
    totalEl.textContent = fmt(total);
  }
  if (amount && period) {
    amount.addEventListener("input", calc);
    period.addEventListener("input", calc);
    calc();
  }
 
  /* ---------- Testimonials slider ---------- */
  var slides = document.getElementById("slides");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var dotsWrap = document.getElementById("dots");
  if (slides) {
    var items = slides.children.length;
    var index = 0;
    function perView() { return window.innerWidth >= 860 ? 2 : 1; }
    function maxIndex() { return Math.max(0, items - perView()); }
    function buildDots() {
      dotsWrap.innerHTML = "";
      for (var i = 0; i <= maxIndex(); i++) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (n) { b.addEventListener("click", function () { index = n; update(); }); })(i);
        dotsWrap.appendChild(b);
      }
    }
    function update() {
      if (index > maxIndex()) index = maxIndex();
      var step = 100 / perView();
      slides.style.transform = "translateX(-" + index * step + "%)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === index);
      });
    }
    if (nextBtn) nextBtn.addEventListener("click", function () { index = index >= maxIndex() ? 0 : index + 1; update(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { index = index <= 0 ? maxIndex() : index - 1; update(); });
    buildDots(); update();
    var auto = setInterval(function () { index = index >= maxIndex() ? 0 : index + 1; update(); }, 6000);
    slides.addEventListener("mouseenter", function () { clearInterval(auto); });
    var resizeT;
    window.addEventListener("resize", function () { clearTimeout(resizeT); resizeT = setTimeout(function () { buildDots(); update(); }, 200); });
  }
 
  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-header").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var body = btn.nextElementSibling;
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".acc-item").forEach(function (it) {
        it.classList.remove("open");
        it.querySelector(".acc-header").setAttribute("aria-expanded", "false");
        it.querySelector(".acc-body").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
 
  /* ---------- Loan form ---------- */
  var loanForm = document.getElementById("loanForm");
  if (loanForm) {
    loanForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      loanForm.querySelectorAll("[required]").forEach(function (f) {
        if (!f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))) {
          f.classList.add("invalid"); valid = false;
        } else { f.classList.remove("invalid"); }
      });
      if (!valid) return;
      var success = document.getElementById("formSuccess");
      if (success) success.hidden = false;
      loanForm.reset();
      setTimeout(function () { if (success) success.hidden = true; }, 6000);
    });
    loanForm.querySelectorAll("input,select,textarea").forEach(function (f) {
      f.addEventListener("input", function () { f.classList.remove("invalid"); });
    });
  }
 
  /* ---------- Newsletter ---------- */
  var news = document.getElementById("newsletterForm");
  if (news) {
    news.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = document.getElementById("newsSuccess");
      if (ok) { ok.hidden = false; news.reset(); setTimeout(function () { ok.hidden = true; }, 5000); }
    });
  }
 
  /* ---------- Live chat assistant ---------- */
  var chatToggle = document.getElementById("chatToggle");
  var chatPanel = document.getElementById("chatPanel");
  var chatClose = document.getElementById("chatClose");
  var chatForm = document.getElementById("chatForm");
  var chatText = document.getElementById("chatText");
  var chatBody = document.getElementById("chatBody");
 
  function botReply(q) {
    var s = q.toLowerCase();
    if (s.indexOf("apply") > -1) return "Great! You can apply using the form in our Contact section, or tap 'Apply Now'. It only takes a few minutes. Want me to scroll you there?";
    if (s.indexOf("rate") > -1 || s.indexOf("interest") > -1) return "Our rates start from about 1.5% per month, depending on the product and your profile. Try the Loan Calculator for an instant estimate!";
    if (s.indexOf("approval") > -1 || s.indexOf("fast") > -1 || s.indexOf("long") > -1) return "Most loans are approved within 24 hours — emergency loans can be even faster once documents are verified.";
    if (s.indexOf("document") > -1 || s.indexOf("qualify") > -1) return "You'll typically need a national ID and proof of income. Businesses may also provide registration documents. See our FAQ for details!";
    if (s.indexOf("hello") > -1 || s.indexOf("hi") > -1) return "Hello! 😊 How can I help with your financing today?";
    return "Thanks for your message! An advisor will follow up shortly. Meanwhile, you can call us at +256 700 000 000 or use the application form.";
  }
  function addMsg(text, who) {
    var d = document.createElement("div");
    d.className = "chat-msg " + who;
    d.textContent = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function sendUser(text) {
    addMsg(text, "user");
    setTimeout(function () { addMsg(botReply(text), "bot"); }, 600);
  }
  if (chatToggle && chatPanel) {
    chatToggle.addEventListener("click", function () {
      var open = chatPanel.hidden;
      chatPanel.hidden = !open;
      chatToggle.setAttribute("aria-expanded", String(open));
    });
  }
  if (chatClose) chatClose.addEventListener("click", function () { chatPanel.hidden = true; chatToggle.setAttribute("aria-expanded", "false"); });
  if (chatForm) {
    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = chatText.value.trim();
      if (!v) return;
      sendUser(v); chatText.value = "";
    });
  }
  document.querySelectorAll(".chip-btn").forEach(function (b) {
    b.addEventListener("click", function () { sendUser(b.getAttribute("data-q")); });
  });
})();