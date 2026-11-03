/* AITHYR — the cave. no frameworks, no build step, no dignity. */

(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── typing ─────────────────────────────────────────────── */
  const PHRASES = [
    "certified girlfailure ✦ cave dweller",
    "emotionally unavailable (compiling)",
    "i will fix it in prod ✦ she will not",
    "down bad for green CI",
    "no thoughts ✦ just a terminal and vibes",
    "do not perceive me ✦ i am not here",
    "built at 4am ✦ shipped anyway",
  ];

  const out = document.getElementById("typed");
  if (out) {
    if (reduced) {
      out.textContent = PHRASES[0];
    } else {
      let phrase = 0;
      let char = 0;
      let deleting = false;

      const tick = () => {
        const current = PHRASES[phrase];
        out.textContent = current.slice(0, char);

        if (!deleting && char === current.length) {
          deleting = true;
          return setTimeout(tick, 2100);
        }
        if (deleting && char === 0) {
          deleting = false;
          phrase = (phrase + 1) % PHRASES.length;
          return setTimeout(tick, 420);
        }
        char += deleting ? -1 : 1;
        setTimeout(tick, deleting ? 22 : 46 + Math.random() * 34);
      };

      out.textContent = "";
      setTimeout(tick, 700);
    }
  }

  /* ── reveal on scroll ───────────────────────────────────── */
  const targets = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));
  }

  /* ── pointer spotlight ──────────────────────────────────── */
  const spot = document.getElementById("spotlight");
  const fine = window.matchMedia("(pointer: fine)").matches;

  if (spot && fine && !reduced) {
    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      spot.style.setProperty("--mx", `${x}px`);
      spot.style.setProperty("--my", `${y}px`);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        x = event.clientX;
        y = event.clientY;
        spot.classList.add("is-live");
        if (!raf) raf = requestAnimationFrame(paint);
      },
      { passive: true }
    );

    document.addEventListener("pointerleave", () => spot.classList.remove("is-live"));
  }

  /* ── cave clock ─────────────────────────────────────────── */
  const clock = document.getElementById("clock");
  if (clock) {
    const render = () => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };
    render();
    setInterval(render, 30000);
  }
})();
