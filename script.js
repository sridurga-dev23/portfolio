/* =====================================================================
   SRI DURGA — PORTFOLIO SCRIPT
   Pure vanilla JavaScript. No dependencies.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. LOADING SCREEN
     Hide the loader once the page has painted, with a short minimum
     duration so the intro animation isn't cut off on fast loads.
  --------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const MIN_LOADER_TIME = 1400;
  const loadStart = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - loadStart;
    const wait = Math.max(MIN_LOADER_TIME - elapsed, 0);
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.style.overflow = '';
    }, wait);
  });


  /* ---------------------------------------------------------------
     2. CUSTOM CURSOR
     A small dot that tracks the pointer exactly, and a lagging ring
     for a softer, premium feel. Enlarges on interactive elements.
  --------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  
  const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (supportsFinePointer && cursorDot ) {
    let mouseX = 0, mouseY = 0;
  

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

   


  }


  /* ---------------------------------------------------------------
     3. NAVBAR: scroll blur state + active link tracking
  --------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const railFill = document.getElementById('railFill');
  const scrollTopBtn = document.getElementById('scrollTop');

  const onScroll = () => {
    const y = window.scrollY;

    // Navbar blur state
    navbar.classList.toggle('scrolled', y > 40);

    // Scroll progress rail
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    if (railFill) railFill.style.height = `${Math.min(progress, 100)}%`;

    // Scroll-to-top button visibility
    scrollTopBtn.classList.toggle('visible', y > 600);

    // Active nav link based on section in view
    let currentId = sections[0] ? sections[0].id : '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksWrap.classList.toggle('open');
  });
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksWrap.classList.remove('open');
    });
  });

  // Scroll to top
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------------------
     4. TYPING EFFECT (hero role line)
  --------------------------------------------------------------- */
  const typedEl = document.getElementById('typedRole');
  const roles = [
    'Full Stack Developer',
    'Web Developer',
    'CS Engineering Student',
    'Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = false;

  const TYPE_SPEED = 70;
  const DELETE_SPEED = 40;
  const HOLD_TIME = 1600;

  const typeLoop = () => {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      typedEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeLoop, HOLD_TIME);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeLoop, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  };

  setTimeout(typeLoop, 900);


  /* ---------------------------------------------------------------
     5. SCROLL REVEAL (fade / slide-up / slide-left / slide-right)
     Uses IntersectionObserver so elements animate in once, the
     first time they enter the viewport.
  --------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.reveal-fade, .reveal-up, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));


  /* ---------------------------------------------------------------
     6. HERO MOUSE PARALLAX + SCROLL PARALLAX
     The hero portrait drifts subtly toward the pointer, and shifts
     slightly on scroll for a sense of depth. Background stays static.
  --------------------------------------------------------------- */
  const heroVisual = document.getElementById('heroVisual');
  const heroImg = document.getElementById('heroImg');
  const hero = document.querySelector('.hero');

  if (supportsFinePointer && heroVisual) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      const moveX = relX * 18;
      const moveY = relY * 18;
      heroVisual.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'translate(0, 0)';
    });
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight && heroImg) {
      heroImg.style.transform = `translateY(${y * 0.18}px) scale(1.02)`;
    }
  }, { passive: true });


  /* ---------------------------------------------------------------
     7. BUTTON RIPPLE EFFECT
     Positions a ripple pseudo-element at the click point via CSS
     custom properties, then triggers the ripple animation.
  --------------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--ry', `${e.clientY - rect.top}px`);
      btn.classList.remove('rippling');
      // Force reflow so the animation restarts on rapid re-clicks
      void btn.offsetWidth;
      btn.classList.add('rippling');
    });
  });

});
function toggleDetails(id){

    const details=document.getElementById(id);

    if(details.style.display==="block"){
        details.style.display="none";
    }
    else{
        details.style.display="block";
        details.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });
    }

}