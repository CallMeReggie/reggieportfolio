/* js/main.js */
(function () {
  const data = window.portfolioData || {};

  const profile = data.profile || {};
  const about = data.about || {};
  const skills = data.skills || {};
  const experience = data.experience || {};
  const education = data.education || {};
  const contact = data.contact || {};

  const $ = (id) => document.getElementById(id);
  const htmlEscapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => htmlEscapeMap[character]);
  }

  function highlightMatch(text, match) {
    const safeText = escapeHtml(text);
    const safeMatch = escapeHtml(match);

    if (!safeMatch || !safeText.includes(safeMatch)) {
      return safeText;
    }

    return safeText.replace(safeMatch, `<span class="accent-text">${safeMatch}</span>`);
  }

  function cleanPhone(phone) {
    return String(phone ?? "").replace(/[^\d+]/g, "");
  }

  function renderSectionHead(title, subtitle, number) {
    return `
      <div class="section-head reveal">
        <span class="section-kicker">${escapeHtml(number || "")}</span>
        <div>
          <h2>${escapeHtml(title || "")}</h2>
          <p>${escapeHtml(subtitle || "")}</p>
        </div>
      </div>
    `;
  }

  function renderList(items, className = "clean-list") {
    return `
      <ul class="${className}">
        ${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `;
  }

  function renderDetailRows(items) {
    return `
      <div class="detail-grid">
        ${(items || [])
          .filter((item) => item && item.label && item.value)
          .map(
            (item) => `
              <div class="detail-row">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function setGlobalContent() {
    document.title = profile.siteTitle || "Portfolio";

    const brand = $("brandName");
    const footer = $("footerText");
    const metaDescription = document.querySelector('meta[name="description"]');

    if (brand) {
      brand.textContent = profile.brandName || "Portfolio";
    }

    if (footer) {
      const year = new Date().getFullYear();
      const brandName = escapeHtml(profile.brandName || "Portfolio");
      const footerNote = escapeHtml(profile.footerText || "");
      footer.innerHTML = `${brandName} · ${year}${footerNote ? ` · ${footerNote}` : ""}`;
    }

    if (metaDescription && profile.summary) {
      metaDescription.setAttribute(
        "content",
        String(profile.summary).replace(/\s+/g, " ").trim()
      );
    }
  }

  function renderHero() {
    const quick = profile.quickProfile || {};
    const hero = $("hero");

    if (!hero) return;

    const statsHtml = (profile.stats || [])
      .map(
        (item) => `
          <article class="stat reveal">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.text)}</span>
          </article>
        `
      )
      .join("");

    hero.innerHTML = `
      <div class="container hero-grid">
        <div class="hero-copy reveal">
          <span class="badge">${escapeHtml(profile.badge || "Portfolio")}</span>
          <div class="hero-heading-stack">
            <h1>${highlightMatch(profile.heading || "", profile.brandName || "")}</h1>
          </div>
          <p class="hero-text">${escapeHtml(profile.summary || "")}</p>

          <div class="button-group reveal">
            <a class="btn btn-primary" href="#contact"><span>Contact Me</span></a>
            <a class="btn btn-secondary" href="mailto:${escapeHtml(contact.email || "")}"><span>Email Me</span></a>
          </div>

          <div class="stats">
            ${statsHtml}
          </div>
        </div>

        <aside class="hero-side reveal">
          <div class="card profile-card interactive-card">
            <div class="portrait-frame">
              <div class="portrait-ring"></div>
              <img src="${escapeHtml(profile.image || "profile.jpg")}" alt="Profile illustration" />
            </div>

            <div class="profile-card-content">
              <div class="micro-label">Quick Profile</div>
              <h3>${escapeHtml(profile.brandName || "Portfolio")}</h3>
              <ul class="info-grid">
                ${[
                  ["Location", quick.location],
                  ["Availability", quick.availability],
                  ["Languages", quick.languages],
                  ["Tools", quick.tools]
                ]
                  .filter(([, value]) => value)
                  .map(
                    ([label, value]) => `
                      <li>
                        <span>${escapeHtml(label)}</span>
                        <strong>${escapeHtml(value)}</strong>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    `;
  }

  function renderAbout() {
    const aboutSection = $("about");
    const quick = profile.quickProfile || {};

    if (!aboutSection) return;

    const aboutDetails = [
      { label: "Location", value: quick.location },
      { label: "Availability", value: quick.availability },
      { label: "Languages", value: quick.languages },
      { label: "Tools", value: quick.tools }
    ].filter((item) => item.value);

    aboutSection.innerHTML = `
      <div class="container section-wrap">
        ${renderSectionHead(about.title, about.subtitle, "01")}

        <div class="about-grid">
          <article class="card panel interactive-card reveal">
            <p class="lead-copy">${escapeHtml(about.body || "")}</p>
          </article>

          <aside class="card panel interactive-card reveal">
            <div class="panel-head">
              <span class="mini-number">A</span>
              <h3>Professional Snapshot</h3>
            </div>
            ${renderDetailRows(aboutDetails)}
          </aside>
        </div>
      </div>
    `;
  }

  function renderSkills() {
    const skillsSection = $("skills");

    if (!skillsSection) return;

    const skillCards = (skills.groups || [])
      .map(
        (group, index) => `
          <article class="card panel skill-card interactive-card reveal">
            <div class="panel-head">
              <span class="mini-number">${String(index + 1).padStart(2, "0")}</span>
              <h3>${escapeHtml(group.title)}</h3>
            </div>
            ${renderList(group.items, "clean-list")}
          </article>
        `
      )
      .join("");

    const tools = (skills.tools || [])
      .map((tool) => `<span class="pill">${escapeHtml(tool)}</span>`)
      .join("");

    skillsSection.innerHTML = `
      <div class="container section-wrap">
        ${renderSectionHead(skills.title, skills.subtitle, "02")}

        <div class="grid grid-3">
          ${skillCards}
        </div>

        <article class="card panel tools-card interactive-card reveal">
          <div class="panel-head">
            <span class="mini-number">T</span>
            <h3>Tools and Platforms</h3>
          </div>
          <div class="pill-wrap">${tools}</div>
        </article>
      </div>
    `;
  }

  function renderExperience() {
    const experienceSection = $("experience");

    if (!experienceSection) return;

    const timeline = (experience.timeline || [])
      .map(
        (item) => `
          <li class="timeline-item">
            <div class="timeline-card">
              <span class="timeline-period">${escapeHtml(item.period)}</span>
              <h4>${escapeHtml(item.title)}</h4>
              <p>${escapeHtml(item.description)}</p>
            </div>
          </li>
        `
      )
      .join("");

    experienceSection.innerHTML = `
      <div class="container section-wrap">
        ${renderSectionHead(experience.title, experience.subtitle, "03")}

        <div class="grid grid-2 experience-grid">
          <article class="card panel interactive-card reveal">
            <div class="panel-head">
              <span class="mini-number">E</span>
              <h3>Experience</h3>
            </div>
            <ul class="timeline">${timeline}</ul>
          </article>

          <article class="card panel interactive-card reveal">
            <div class="panel-head">
              <span class="mini-number">+</span>
              <h3>Achievements</h3>
            </div>
            ${renderList(experience.achievements, "achievement-list")}
          </article>
        </div>
      </div>
    `;
  }

  function renderEducation() {
    const educationSection = $("education");

    if (!educationSection) return;

    const details = (education.details || [])
      .map(
        (item) => `
          <div class="detail-tile">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </div>
        `
      )
      .join("");

    educationSection.innerHTML = `
      <div class="container section-wrap">
        ${renderSectionHead(education.title, education.subtitle, "04")}

        <article class="card panel interactive-card reveal">
          <div class="panel-head">
            <span class="mini-number">ED</span>
            <h3>Academic Background</h3>
          </div>
          <div class="detail-tile-grid">
            ${details}
          </div>
        </article>
      </div>
    `;
  }

  function renderContact() {
    const contactSection = $("contact");

    if (!contactSection) return;

    const phoneHref = cleanPhone(contact.phone || "");
    const noteHtml = contact.note ? `<p class="note">${escapeHtml(contact.note)}</p>` : "";

    contactSection.innerHTML = `
      <div class="container section-wrap">
        ${renderSectionHead(contact.title, contact.subtitle, "05")}

        <div class="contact-grid">
          <article class="card panel contact-intro interactive-card reveal">
            <span class="badge alt-badge">Open to opportunities</span>
            <h3>Let’s connect and talk about your next opportunity.</h3>
            <p>
              Reach out for internships, part-time roles, full-time opportunities, or professional conversations.
              I am ready to learn, contribute, and grow in a strong team environment.
            </p>
            <div class="button-group">
              <a class="btn btn-primary" href="mailto:${escapeHtml(contact.email || "")}"><span>Send Email</span></a>
              ${phoneHref ? `<a class="btn btn-secondary" href="tel:${escapeHtml(phoneHref)}"><span>Call Me</span></a>` : ""}
            </div>
          </article>

          <aside class="card panel contact-panel interactive-card reveal">
            <div class="panel-head">
              <span class="mini-number">CT</span>
              <h3>Contact Details</h3>
            </div>
            <ul class="contact-list">
              ${contact.email ? `<li><span>Email</span><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></li>` : ""}
              ${contact.phone ? `<li><span>Phone</span><a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(contact.phone)}</a></li>` : ""}
              ${contact.location ? `<li><span>Location</span><p>${escapeHtml(contact.location)}</p></li>` : ""}
            </ul>
            ${noteHtml}
          </aside>
        </div>
      </div>
    `;
  }

  function initRevealAnimations() {
    const revealElements = [...document.querySelectorAll(".reveal")];

    if (!revealElements.length) return;

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 4) * 80}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, localObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            localObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function initHeaderAndActiveLinks() {
    const header = document.querySelector(".site-header");
    const navLinks = [...document.querySelectorAll(".nav-links a")];
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    function syncHeaderState() {
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 12);
      }
    }

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function init() {
    setGlobalContent();
    renderHero();
    renderAbout();
    renderSkills();
    renderExperience();
    renderEducation();
    renderContact();
    initRevealAnimations();
    initHeaderAndActiveLinks();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
