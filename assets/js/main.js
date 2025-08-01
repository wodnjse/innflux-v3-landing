// Main JavaScript file for Innflux Landing Page

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initHeaderScroll();
  initSupabase();
  initModalHandlers();
  initFAQInteractions();
  initFeatureInteractions();
  initGradientFollow();
  initHowItWorks();
  initFormValidation();
});

// Header scroll behavior
function initHeaderScroll() {
  const headerScroll = {
    lastY: window.scrollY,
    lastTime: Date.now(),
    header: document.querySelector('.header'),
    threshold: 50,
    timeout: 150,
    ticking: false,

    handleScroll() {
      const currentY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - this.lastTime;
      
      if (timeDiff > this.timeout) {
        if (currentY > this.lastY && currentY > this.threshold) {
          this.header.classList.add('hidden');
        } else {
          this.header.classList.remove('hidden');
        }
        this.lastTime = currentTime;
      }
      this.lastY = currentY;
    },

    init() {
      window.addEventListener('scroll', () => {
        if (!this.ticking) {
          window.requestAnimationFrame(() => {
            this.handleScroll();
            this.ticking = false;
          });
          this.ticking = true;
        }
      });
    }
  };

  headerScroll.init();
}

// Supabase integration
function initSupabase() {
  // Supabase 클라이언트 생성
  const supabaseUrl = 'https://kdxjkolsyofpxalcrxwg.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeGprb2xzeW9mcHhhbGNyeHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNzg5NzMsImV4cCI6MjA2ODY1NDk3M30.Kdtp2iZZuzjcqxdodJ4VCDNvgcIMWRSoUWFcc6SYTlw';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // 폼 제출 이벤트에 Supabase 연동 추가
  document.getElementById('earlyAccessForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // 입력값 수집
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const telegram = document.getElementById('telegram').value;
    const xUsername = document.getElementById('x').value;
    const message = document.getElementById('message').value;

    if (!email && !telegram && !xUsername) {
      alert('Please provide at least one contact method (Email, Telegram, or X Username)');
      return;
    }

    // Supabase에 데이터 저장
    const { data, error } = await supabase
      .from('early_access')
      .insert([
        { name, email, telegram, x: xUsername, message }
      ]);

    if (error) {
      alert('저장에 실패했습니다: ' + error.message);
      return;
    }

    // 성공 시 토스트 알림
    const toast = document.getElementById('successToast');
    toast.classList.add('show');
    closeModal();
    e.target.reset();
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
  });
}

// Modal handlers
function initModalHandlers() {
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('earlyAccessModal');
    if (event.target === modal) {
      closeModal();
    }
  });
}

// FAQ interactions
function initFAQInteractions() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// Feature interactions
function initFeatureInteractions() {
  document.querySelectorAll('.feature-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Remove active class from all items
      document.querySelectorAll('.feature-item').forEach(i => {
        i.classList.remove('active');
      });
      // Add active class to current item
      item.classList.add('active');
    });
  });
  
  // Reset feature items when mouse leaves the feature column
  document.querySelectorAll('.feature-column').forEach(column => {
    column.addEventListener('mouseleave', () => {
      document.querySelectorAll('.feature-item').forEach(item => {
        item.classList.remove('active');
      });
    });
  });
}

// Gradient follow mouse movement
function initGradientFollow() {
  const hero = document.querySelector('.hero');
  const gradient = document.querySelector('.gradient-follow');
  const cardsContainer = document.querySelector('.cards-container');
  
  if (!hero || !gradient || !cardsContainer) return;
  
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  // Linear interpolation function
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
  
  function updateGradientPosition(e) {
    const rect = hero.getBoundingClientRect();
    const cardsRect = cardsContainer.getBoundingClientRect();
    
    // Hide gradient if scrolled past half of the cards container
    if (cardsRect.bottom < window.innerHeight * 0.7) {
      gradient.style.opacity = '0';
      return;
    }
    
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
    
    if (!gradient.style.opacity || gradient.style.opacity === '0') {
      currentX = targetX;
      currentY = targetY;
      gradient.style.opacity = '1';
    }
  }
  
  function handleMouseLeave() {
    gradient.style.opacity = '0';
  }

  // Add scroll event listener
  window.addEventListener('scroll', () => {
    const cardsRect = cardsContainer.getBoundingClientRect();
    if (cardsRect.bottom < window.innerHeight * 0.7) {
      gradient.style.opacity = '0';
    } else if (cardsRect.top > 0) {
      gradient.style.opacity = '1';
    }
  });

  function animate() {
    if (gradient.style.opacity === '1') {
      // Smooth movement with lerp
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      
      gradient.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animate);
  }
  
  hero.addEventListener('mousemove', updateGradientPosition);
  hero.addEventListener('mouseleave', handleMouseLeave);
  
  // Start the animation loop
  animate();
}

// How it Works section interactions
function initHowItWorks() {
  const stepItems = document.querySelectorAll('.step-item');
  const flowDiagrams = document.querySelectorAll('.flow-diagram');
  
  let currentStep = 0;
  
  // Initialize first step
  function initializeFirstStep() {
    stepItems.forEach((item, index) => {
      if (index === 0) {
        item.classList.add('active');
        item.classList.add('initial-active');
      } else {
        item.classList.remove('active', 'initial-active');
      }
    });
    
    flowDiagrams.forEach((diagram, index) => {
      if (index === 0) {
        diagram.classList.add('active');
      } else {
        diagram.classList.remove('active');
      }
    });
    

  }
  
  // Simple step activation
    function activateStep(stepIndex) {
    if (stepIndex === currentStep) return;
    
    // Update step items
    stepItems.forEach((item, index) => {
      if (index === stepIndex) {
        item.classList.add('active');
        item.classList.remove('initial-active');
      } else {
        item.classList.remove('active', 'initial-active');
      }
    });
    
    // Update flow diagrams
    flowDiagrams.forEach((diagram, index) => {
      if (index === stepIndex) {
        diagram.classList.add('active');
      } else {
        diagram.classList.remove('active');
      }
    });
    
    currentStep = stepIndex;
  }
  
  // Clean initialization
  
  // Simple scroll handler
  function handleScroll() {
    const scrollY = window.scrollY;
    
    // Get the sticky wrapper position
    const stickyWrapper = document.querySelector('.how-it-works-sticky-wrapper');
    if (!stickyWrapper) return;
    
    const wrapperTop = stickyWrapper.offsetTop;
    const scrollIntoSection = scrollY - wrapperTop;
    
    console.log(`Scroll: ${scrollY}px, Wrapper top: ${wrapperTop}px, Into section: ${scrollIntoSection}px`);
    
    // For small screens, use simpler logic
    const isMobile = window.innerWidth <= 1023;
    
    if (isMobile) {
      // Mobile: use direct scrollY thresholds
      let targetStep = Math.floor(scrollY / 200) % 3;
      
      console.log(`Mobile: scrollY ${scrollY}px -> target step ${targetStep}`);
      
      if (targetStep !== currentStep) {
        console.log(`🔄 Mobile: Activating step ${targetStep} from ${currentStep}`);
        activateStep(targetStep);
        }
      } else {
      // Desktop: use sticky section logic
      const triggerOffset = 0;
      
      if (scrollIntoSection >= triggerOffset) {
        let targetStep = Math.floor(scrollIntoSection / 100) % 3;
        targetStep = Math.max(0, targetStep);
        
        console.log(`Desktop: In sticky section, target step: ${targetStep}, current step: ${currentStep}`);
        
        if (targetStep !== currentStep) {
          console.log(`🔄 Desktop: Activating step ${targetStep} from ${currentStep}`);
          activateStep(targetStep);
        }
      }
    }
  }
  
  // Force mobile transitions with manual triggers
  function forceMobileTransitions() {
    if (window.innerWidth <= 1023) {
      console.log('🔄 Force mobile transition check');
      let targetStep = (currentStep + 1) % 3;
      console.log(`🔄 Force activating step ${targetStep} from ${currentStep}`);
      activateStep(targetStep);
    }
  }
  

  
  // Scroll-based transitions for small screens
  let lastScrollY = 0;
  let scrollDirection = 0;
  let scrollThreshold = 10; // Reduced threshold for easier triggering
  let lastTouchY = 0;
  let lastWheelDelta = 0;
  let isTransitioning = false; // Prevent multiple transitions
  let sectionStartY = 0; // Track when section starts
  let sectionEndY = 0; // Track when section ends
  let isInStickySection = false; // Track if we're in the sticky section
  
  function handleSmallScreenScroll() {
    if (window.innerWidth > 1023) return;
    
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    // Simple scroll-based transitions
    if (Math.abs(scrollDelta) > scrollThreshold && !isTransitioning) {
      isTransitioning = true;
      
      if (scrollDelta > 0) {
        // Scrolling down
        let targetStep = Math.min(currentStep + 1, 2); // Don't cycle back to 0
        if (targetStep !== currentStep) {
          activateStep(targetStep);
        }
      } else {
        // Scrolling up
        let targetStep = Math.max(currentStep - 1, 0); // Don't cycle back to 2
        if (targetStep !== currentStep) {
          activateStep(targetStep);
        }
      }
      
      lastScrollY = currentScrollY;
      
      // Reset transition flag after a delay
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  }
  
  // Wheel-based scroll detection for PC
  function handleWheelScroll(e) {
    if (window.innerWidth > 1023) return;
    
    const wheelDelta = e.deltaY;
    const wheelThreshold = 10;
    
    if (Math.abs(wheelDelta) > wheelThreshold && !isTransitioning) {
      isTransitioning = true;
      
      if (wheelDelta > 0) {
        // Scrolling down
        let targetStep = Math.min(currentStep + 1, 2);
        if (targetStep !== currentStep) {
          activateStep(targetStep);
        }
      } else {
        // Scrolling up
        let targetStep = Math.max(currentStep - 1, 0);
        if (targetStep !== currentStep) {
          activateStep(targetStep);
        }
      }
      
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  }
  
  // Keyboard-based navigation for PC testing
  function handleKeyNavigation(e) {
    if (window.innerWidth > 1023) return;
    
    if (!isTransitioning) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        let targetStep = Math.min(currentStep + 1, 2); // Don't cycle back to 0
        if (targetStep !== currentStep) {
          console.log(`⌨️ Key down -> step ${targetStep}`);
          activateStep(targetStep);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        let targetStep = Math.max(currentStep - 1, 0); // Don't cycle back to 2
        if (targetStep !== currentStep) {
          console.log(`⌨️ Key up -> step ${targetStep}`);
          activateStep(targetStep);
        }
      }
    }
  }
  
  // Touch-based scroll detection
  function handleTouchStart(e) {
    if (window.innerWidth > 1023) return;
    lastTouchY = e.touches[0].clientY;
  }
  
      function handleTouchMove(e) {
    if (window.innerWidth > 1023) return;
    
    const currentTouchY = e.touches[0].clientY;
    const touchDelta = lastTouchY - currentTouchY;
    
    if (Math.abs(touchDelta) > scrollThreshold && !isTransitioning) {
      isTransitioning = true;
      
      if (touchDelta > 0) {
        // Swiping up (scrolling down)
        let targetStep = Math.min(currentStep + 1, 2);
        if (targetStep !== currentStep) {
          activateStep(targetStep);
        }
      } else {
        // Swiping down (scrolling up)
        let targetStep = Math.max(currentStep - 1, 0);
        if (targetStep !== currentStep) {
          activateStep(targetStep);
        }
      }
      
      lastTouchY = currentTouchY;
      
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
  }
  
  // Initialize
  initializeFirstStep();
  
  // Add multiple scroll listeners to ensure it works
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('scroll', handleSmallScreenScroll, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('wheel', handleWheelScroll, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  
  // Add manual transition triggers for testing
  window.addEventListener('keydown', handleKeyNavigation);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      forceMobileTransitions();
    }
  });
  
  // Remove click triggers - no longer needed
  
  // Initial check
  setTimeout(handleScroll, 100);
  setTimeout(handleSmallScreenScroll, 200);
  

  

}

// Form validation
function initFormValidation() {
  // Add validation for contact methods
  const contactInputs = document.querySelectorAll('.contact-input');
  contactInputs.forEach(input => {
    input.addEventListener('input', function() {
      const hasValue = Array.from(contactInputs).some(input => input.value.trim() !== '');
      contactInputs.forEach(input => {
        input.required = !hasValue;
      });
    });
  });
}

// Global modal functions
function openModal() {
  const modal = document.getElementById('earlyAccessModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Clear form when opening from header button
  document.getElementById('earlyAccessForm').reset();
}

function openModalFromCTA() {
  const modal = document.getElementById('earlyAccessModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  // Get email from CTA input if exists
  const ctaEmailInput = document.querySelector('.cta-email-input');
  if (ctaEmailInput && ctaEmailInput.value) {
    document.getElementById('email').value = ctaEmailInput.value;
  }
}

function closeModal() {
  const modal = document.getElementById('earlyAccessModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Make functions globally available
window.openModal = openModal;
window.openModalFromCTA = openModalFromCTA;
window.closeModal = closeModal; 