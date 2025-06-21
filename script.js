// Alexchad Hub - Advanced UI Script
// Author: ChatGPT (for Alexchad)
// Description: Handles tab transitions, animations, modals, settings, and UI effects.

// Wait for DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const navLinks = document.querySelectorAll(".nav-links a");
  const header = document.querySelector("header");
  const discordBtn = document.querySelector(".discord-btn");
  const copyBtn = document.querySelector(".copy-btn");
  const loadstringInput = document.getElementById("loadstringInput");
  const modalOverlay = document.getElementById("modalOverlay");
  const addGameForm = document.getElementById("addGameForm");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const gamesList = document.querySelector("#games ul");
  const settingsForm = document.getElementById("settingsForm");
  const themeSelect = document.getElementById("themeSelect");
  const animationsToggle = document.getElementById("animationsToggle");
  let activeTab = "home";

  // Initialize UI states
  init();

  function init() {
    // Show initial tab and underline nav link
    activateTab(activeTab, false);
    createNavUnderline();
    updateTheme(themeSelect.value);
    if (!animationsToggle.checked) {
      document.body.classList.add("no-animations");
    }

    // Setup event listeners
    setupNavEvents();
    setupButtonAnimations();
    setupModalEvents();
    setupFormEvents();
    setupScrollEffects();
  }

  // **********************
  // NAVIGATION & TABS
  // **********************

  // Create a dynamic underline for nav links
  let navUnderline = document.createElement("div");
  navUnderline.className = "nav-underline";
  document.querySelector("nav").appendChild(navUnderline);

  function createNavUnderline() {
    const activeLink = document.querySelector(".nav-links a.active");
    if (!activeLink) return;
    const rect = activeLink.getBoundingClientRect();
    const navRect = activeLink.parentElement.parentElement.getBoundingClientRect();

    navUnderline.style.position = "absolute";
    navUnderline.style.bottom = "0";
    navUnderline.style.height = "3px";
    navUnderline.style.backgroundColor = "#00aaff";
    navUnderline.style.borderRadius = "3px 3px 0 0";
    navUnderline.style.transition = "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)";
    navUnderline.style.left = (rect.left - navRect.left) + "px";
    navUnderline.style.width = rect.width + "px";
  }

  function animateNavUnderline(targetLink) {
    const rect = targetLink.getBoundingClientRect();
    const navRect = targetLink.parentElement.parentElement.getBoundingClientRect();

    navUnderline.style.left = (rect.left - navRect.left) + "px";
    navUnderline.style.width = rect.width + "px";
  }

  function setupNavEvents() {
    navLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const targetTab = link.getAttribute("data-tab");
        if (targetTab === activeTab) return;
        activateTab(targetTab, true);
        animateNavUnderline(link);
      });

      // Keyboard navigation arrows
      link.addEventListener("keydown", e => {
        const idx = Array.from(navLinks).indexOf(e.target);
        if (e.key === "ArrowRight") {
          navLinks[(idx + 1) % navLinks.length].focus();
          e.preventDefault();
        } else if (e.key === "ArrowLeft") {
          navLinks[(idx - 1 + navLinks.length) % navLinks.length].focus();
          e.preventDefault();
        } else if (e.key === "Home") {
          navLinks[0].focus();
          e.preventDefault();
        } else if (e.key === "End") {
          navLinks[navLinks.length - 1].focus();
          e.preventDefault();
        }
      });
    });
  }

  // Smooth sliding tab transition function
  function activateTab(tabName, animate = true) {
    if (!tabName) return;
    if (!document.getElementById(tabName)) return;

    const newTab = document.getElementById(tabName);
    const oldTab = document.querySelector(".tab.active");

    if (newTab === oldTab) return;

    // Accessibility focus management
    if (oldTab) {
      oldTab.setAttribute("aria-hidden", "true");
      oldTab.tabIndex = -1;
    }
    newTab.setAttribute("aria-hidden", "false");
    newTab.tabIndex = 0;

    if (!animate) {
      if (oldTab) {
        oldTab.classList.remove("active");
        oldTab.style.display = "none";
      }
      newTab.style.display = "block";
      newTab.classList.add("active");
      activeTab = tabName;
      return;
    }

    // Animate sliding left-to-right or right-to-left depending on tab order
    const tabsArray = Array.from(tabs);
    const oldIndex = tabsArray.indexOf(oldTab);
    const newIndex = tabsArray.indexOf(newTab);
    const direction = newIndex > oldIndex ? 1 : -1;

    // Prepare new tab for sliding in
    newTab.style.display = "block";
    newTab.style.position = "absolute";
    newTab.style.left = (direction * 100) + "%";
    newTab.style.top = oldTab ? oldTab.offsetTop + "px" : "0";
    newTab.style.width = "100%";
    newTab.style.transition = "left 0.5s ease";

    // Animate old tab sliding out
    if (oldTab) {
      oldTab.style.position = "absolute";
      oldTab.style.left = "0";
      oldTab.style.top = newTab.style.top;
      oldTab.style.width = "100%";
      oldTab.style.transition = "left 0.5s ease";

      requestAnimationFrame(() => {
        oldTab.style.left = (-direction * 100) + "%";
        newTab.style.left = "0%";
      });

      oldTab.addEventListener("transitionend", function onEnd() {
        oldTab.style.position = "";
        oldTab.style.left = "";
        oldTab.style.top = "";
        oldTab.style.width = "";
        oldTab.style.transition = "";
        oldTab.classList.remove("active");
        oldTab.style.display = "none";
        oldTab.removeEventListener("transitionend", onEnd);
      });
    } else {
      // No old tab, just show new tab
      newTab.style.left = "0";
    }

    newTab.classList.add("active");
    activeTab = tabName;
  }

  // **********************
  // BUTTON ANIMATIONS
  // **********************

  function setupButtonAnimations() {
    // Animate copy button hover & press
    if (copyBtn) {
      copyBtn.style.transition = "transform 0.2s ease, background-color 0.3s ease";
      copyBtn.addEventListener("mouseenter", () => {
        copyBtn.style.transform = "scale(1.05)";
        copyBtn.style.backgroundColor = "#33bbff";
      });
      copyBtn.addEventListener("mouseleave", () => {
        copyBtn.style.transform = "scale(1)";
        copyBtn.style.backgroundColor = "#00aaff";
      });
      copyBtn.addEventListener("mousedown", () => {
        copyBtn.style.transform = "scale(0.95)";
      });
      copyBtn.addEventListener("mouseup", () => {
        copyBtn.style.transform = "scale(1.05)";
      });
    }

    // Animate discord button
    if (discordBtn) {
      discordBtn.style.transition = "transform 0.2s ease, background-color 0.3s ease";
      discordBtn.addEventListener("mouseenter", () => {
        discordBtn.style.transform = "scale(1.05)";
        discordBtn.style.backgroundColor = "#4752c4";
      });
      discordBtn.addEventListener("mouseleave", () => {
        discordBtn.style.transform = "scale(1)";
        discordBtn.style.backgroundColor = "#5865f2";
      });
      discordBtn.addEventListener("mousedown", () => {
        discordBtn.style.transform = "scale(0.95)";
      });
      discordBtn.addEventListener("mouseup", () => {
        discordBtn.style.transform = "scale(1.05)";
      });
    }
  }

  // **********************
  // MODAL LOGIC WITH ANIMATION
  // **********************

  // Add animation classes in CSS for modal fade/scale (will add CSS later)
  function openModal() {
    modalOverlay.classList.remove("hidden");
    modalOverlay.style.opacity = "0";
    modalOverlay.style.display = "flex";
    modalOverlay.style.transition = "opacity 0.35s ease";

    requestAnimationFrame(() => {
      modalOverlay.style.opacity = "1";
    });

    // Focus first input for accessibility
    const firstInput = modalOverlay.querySelector("input, select, textarea, button");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modalOverlay.style.opacity = "0";

    modalOverlay.addEventListener("transitionend", function handler() {
      modalOverlay.style.display = "none";
      modalOverlay.classList.add("hidden");
      modalOverlay.removeEventListener("transitionend", handler);
    });

    // Reset form
    addGameForm.reset();
  }

  cancelModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", e => {
    if (e.target === modalOverlay) closeModal();
  });

  // Open modal button (dynamic add button might exist, so query dynamically)
  const addGameBtn = document.getElementById("addGameBtn");
  if (addGameBtn) addGameBtn.addEventListener("click", openModal);

  // **********************
  // GAME FORM SUBMISSION
  // **********************

  addGameForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.gameName.value.trim();
    const status = e.target.gameStatus.value;
    const desc = e.target.gameDesc.value.trim();

    if (!name) {
      alert("Please enter a valid game name.");
      return;
    }

    // Create new list item
    const li = document.createElement("li");
    li.textContent = name + ": ";

    const statusSpan = document.createElement("span");
    statusSpan.textContent = status;
    if (status === "🟢") statusSpan.classList.add("green-dot");
    else if (status === "🟡") statusSpan.style.color = "#e0b000";
    else if (status === "🔴") statusSpan.style.color = "#cc0000";

    li.appendChild(statusSpan);

    if (desc) {
      const descSpan = document.createElement("span");
      descSpan.textContent = " (" + desc + ")";
      descSpan.style.color = "#aaa";
      descSpan.style.fontStyle = "italic";
      li.appendChild(descSpan);
    }

    gamesList.appendChild(li);
    closeModal();
  });

  // **********************
  // COPY LOADSTRING FEEDBACK
  // **********************

  if (copyBtn && loadstringInput) {
    copyBtn.addEventListener("click", () => {
      loadstringInput.select();
      loadstringInput.setSelectionRange(0, 99999);

      navigator.clipboard.writeText(loadstringInput.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        copyBtn.style.backgroundColor = "#33ffbb";

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.backgroundColor = "#00aaff";
        }, 1500);
      }).catch(err => {
        console.error("Failed to copy text:", err);
      });
    });
  }

  // **********************
  // SCROLL-TRIGGERED HEADER SHADOW
  // **********************

  function setupScrollEffects() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = "0 2px 10px rgba(0, 170, 255, 0.5)";
        header.style.backgroundColor = "#101010";
      } else {
        header.style.boxShadow = "none";
        header.style.backgroundColor = "#0d0d0d";
      }
    });
  }

  // **********************
  // THEME SWITCHING
  // **********************

  if (themeSelect) {
    themeSelect.addEventListener("change", e => {
      updateTheme(e.target.value);
    });
  }

  function updateTheme(theme) {
    if (theme === "dark") {
      document.documentElement.style.setProperty("--bg-color", "#121212");
      document.documentElement.style.setProperty("--text-color", "#ddd");
      document.documentElement.style.setProperty("--accent-color", "#00aaff");
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    } else if (theme === "light") {
      document.documentElement.style.setProperty("--bg-color", "#f9f9f9");
      document.documentElement.style.setProperty("--text-color", "#222");
      document.documentElement.style.setProperty("--accent-color", "#0066cc");
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    }
  }

  // **********************
  // SETTINGS FORM TOGGLES
  // **********************

  if (settingsForm) {
    settingsForm.addEventListener("change", e => {
      if (e.target.id === "animationsToggle") {
        if (e.target.checked) {
          document.body.classList.remove("no-animations");
        } else {
          document.body.classList.add("no-animations");
        }
      }
    });
  }
});
// Alexchad Hub - Advanced UI Script Part 2
// Additional helper functions, tweens, and utilities

(() => {
  // Easing functions for smooth animations
  // Robert Penner easing equations (subset)
  const Easing = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => (t < 0.5) ? (2 * t * t) : (-1 + (4 - 2 * t) * t),
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => (t < 0.5) ? (4 * t * t * t) : ((t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => (t < 0.5) ? (8 * t * t * t * t) : (1 - 8 * (--t) * t * t * t),
    easeInQuint: t => t * t * t * t * t,
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    easeInOutQuint: t => (t < 0.5) ? (16 * t * t * t * t * t) : (1 + 16 * (--t) * t * t * t * t)
  };

  // Generic tween function
  // Params: element, cssProp, from, to, duration(ms), easing function, callback
  function tween(element, prop, from, to, duration, easing = Easing.linear, callback) {
    const startTime = performance.now();

    function animate(time) {
      let elapsed = time - startTime;
      if (elapsed > duration) elapsed = duration;

      const progress = easing(elapsed / duration);
      const currentValue = from + (to - from) * progress;

      // For numeric properties
      if (typeof from === "number" && typeof to === "number") {
        element.style[prop] = currentValue + (prop === "opacity" ? "" : "px");
      } else {
        element.style[prop] = currentValue;
      }

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    }
    requestAnimationFrame(animate);
  }

  // Fade in effect on element with optional duration and easing
  function fadeIn(element, duration = 400, easing = Easing.easeOutQuad, callback) {
    element.style.opacity = 0;
    element.style.display = "";
    tween(element, "opacity", 0, 1, duration, easing, callback);
  }

  // Fade out effect on element with optional duration and easing
  function fadeOut(element, duration = 400, easing = Easing.easeInQuad, callback) {
    tween(element, "opacity", 1, 0, duration, easing, () => {
      element.style.display = "none";
      if (callback) callback();
    });
  }

  // Slide in from left
  function slideInFromLeft(element, distance = 100, duration = 500, easing = Easing.easeOutCubic, callback) {
    element.style.transform = `translateX(-${distance}px)`;
    element.style.opacity = 0;
    element.style.display = "";

    tweenTranslateX(element, -distance, 0, duration, easing, () => {
      element.style.transform = "";
      fadeIn(element, 200, easing, callback);
    });
  }

  // Slide out to right
  function slideOutToRight(element, distance = 100, duration = 500, easing = Easing.easeInCubic, callback) {
    tweenTranslateX(element, 0, distance, duration, easing, () => {
      fadeOut(element, 200, easing, () => {
        element.style.transform = "";
        if (callback) callback();
      });
    });
  }

  // Helper: tween transform translateX
  function tweenTranslateX(element, fromX, toX, duration, easing, callback) {
    const startTime = performance.now();

    function animate(time) {
      let elapsed = time - startTime;
      if (elapsed > duration) elapsed = duration;

      const progress = easing(elapsed / duration);
      const currentX = fromX + (toX - fromX) * progress;

      element.style.transform = `translateX(${currentX}px)`;

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    }
    requestAnimationFrame(animate);
  }

  // Scale up effect with fade in
  function scaleUp(element, fromScale = 0.85, toScale = 1, duration = 400, easing = Easing.easeOutBack, callback) {
    element.style.transform = `scale(${fromScale})`;
    element.style.opacity = 0;
    element.style.display = "";

    const startTime = performance.now();

    function animate(time) {
      let elapsed = time - startTime;
      if (elapsed > duration) elapsed = duration;

      const progress = easing(elapsed / duration);
      const currentScale = fromScale + (toScale - fromScale) * progress;
      const currentOpacity = progress;

      element.style.transform = `scale(${currentScale})`;
      element.style.opacity = currentOpacity;

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    }
    requestAnimationFrame(animate);
  }

  // Ease out back easing function (with overshoot)
  Easing.easeOutBack = t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };

  // Debounce utility function
  function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  // Resize event handler with debounce
  window.addEventListener("resize", debounce(() => {
    // Recalculate nav underline position on resize
    const activeLink = document.querySelector(".nav-links a.active");
    if (!activeLink) return;
    const navUnderline = document.querySelector(".nav-underline");
    const rect = activeLink.getBoundingClientRect();
    const navRect = activeLink.parentElement.parentElement.getBoundingClientRect();
    navUnderline.style.left = (rect.left - navRect.left) + "px";
    navUnderline.style.width = rect.width + "px";
  }, 150));

  // Trap focus within modal for accessibility
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
    );

    const firstElem = focusableElements[0];
    const lastElem = focusableElements[focusableElements.length -1];

    modal.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        if (e.shiftKey) { // Shift+Tab
          if (document.activeElement === firstElem) {
            e.preventDefault();
            lastElem.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElem) {
            e.preventDefault();
            firstElem.focus();
          }
        }
      }
    });
  }

  // Dynamic loading simulation for tab content (for example)
  function simulateLoadingTabContent(tabId) {
    const tab = document.getElementById(tabId);
    if (!tab) return;

    tab.innerHTML = '<p>Loading content...</p>';

    setTimeout(() => {
      tab.innerHTML = `<h2>${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Content Loaded</h2><p>This content was loaded dynamically.</p>`;
    }, 1000 + Math.random() * 1500);
  }

  // Keyboard shortcuts: Ctrl+1..4 to switch tabs
  document.addEventListener("keydown", e => {
    if (e.ctrlKey) {
      switch (e.key) {
        case "1": document.querySelector(".nav-links a[data-tab='home']").click(); break;
        case "2": document.querySelector(".nav-links a[data-tab='games']").click(); break;
        case "3": document.querySelector(".nav-links a[data-tab='executors']").click(); break;
        case "4": document.querySelector(".nav-links a[data-tab='developers']").click(); break;
      }
    }
  });

  // Save theme preference to localStorage
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    const savedTheme = localStorage.getItem("alexchad-theme");
    if (savedTheme) {
      themeSelect.value = savedTheme;
      updateTheme(savedTheme);
    }

    themeSelect.addEventListener("change", e => {
      const newTheme = e.target.value;
      updateTheme(newTheme);
      localStorage.setItem("alexchad-theme", newTheme);
    });
  }

  // Accessibility: add ARIA roles and properties dynamically
  function setupARIA() {
    const nav = document.querySelector("nav");
    if (nav) nav.setAttribute("role", "navigation");

    const tabsContainer = document.querySelector("main");
    if (tabsContainer) tabsContainer.setAttribute("role", "main");

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.setAttribute("role", "tab");
      link.setAttribute("aria-selected", link.classList.contains("active") ? "true" : "false");
      link.setAttribute("tabindex", link.classList.contains("active") ? "0" : "-1");
    });

    document.querySelectorAll(".tab").forEach(tab => {
      tab.setAttribute("role", "tabpanel");
      tab.setAttribute("aria-hidden", tab.classList.contains("active") ? "false" : "true");
    });
  }

  setupARIA();

  // Call updateARIA when tabs change
  function updateARIA() {
    document.querySelectorAll(".nav-links a").forEach(link => {
      const selected = link.classList.contains("active");
      link.setAttribute("aria-selected", selected ? "true" : "false");
      link.setAttribute("tabindex", selected ? "0" : "-1");
    });
    document.querySelectorAll(".tab").forEach(tab => {
      tab.setAttribute("aria-hidden", tab.classList.contains("active") ? "false" : "true");
    });
  }

  // Hook into tab activation to update ARIA
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      setTimeout(() => updateARIA(), 10);
    });
  });

  // Utility: debounce function for any purpose
  window.debounce = debounce;

  // Utility: delay / sleep promise
  window.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Export Easing functions for external usage
  window.Easing = Easing;

  // For demo: simulate content loading for 'games' tab on first open
  let gamesTabLoaded = false;
  document.querySelector(".nav-links a[data-tab='games']").addEventListener("click", () => {
    if (!gamesTabLoaded) {
      simulateLoadingTabContent("games");
      gamesTabLoaded = true;
    }
  });

  // For demo: modal trap focus setup if modal exists
  const modal = document.getElementById("modalOverlay");
  if (modal) trapFocus(modal);

  // More helper functions can be added below...

  // Placeholder for future feature additions

})();
