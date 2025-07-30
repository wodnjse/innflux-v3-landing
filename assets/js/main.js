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
  const stepNumbers = document.querySelectorAll('.step-numbers span');
  const howItWorksSection = document.querySelector('.how-it-works');
  let scrollTicking = false;

  if (!howItWorksSection) return;

  function activateStep(index) {
    // Remove all active and initial-active classes
    stepItems.forEach(item => {
      item.classList.remove('active');
      item.classList.remove('initial-active');
    });
    flowDiagrams.forEach(diagram => diagram.classList.remove('active'));
    stepNumbers.forEach(num => num.classList.remove('active'));
    
    // Add active class to selected items
    stepItems[index].classList.add('active');
    flowDiagrams[index].classList.add('active');
    stepNumbers[index].classList.add('active');
  }

  function handleScrollBasedTransitions() {
    const stickyWrapper = document.querySelector('.how-it-works-sticky-wrapper');
    const stickyContainer = document.querySelector('.how-it-works-sticky-container');
    const spacer = document.querySelector('.how-it-works-spacer');
    
    if (!stickyWrapper || !stickyContainer || !spacer) return;
    
    const wrapperRect = stickyWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 1023;
    
    // Check if we're in the sticky wrapper area
    if (wrapperRect.top <= 0 && wrapperRect.bottom > 0) {
      // Calculate progress through the wrapper area (0 to 1)
      const wrapperHeight = wrapperRect.height;
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight - wrapperRect.top) / wrapperHeight
      ));
      
      // Determine which step should be active based on scroll progress
      let activeIndex = -1;
      
      // Mobile-optimized transition points
      if (isMobile) {
        if (scrollProgress > 0.08) {
          activeIndex = 0;
        }
        if (scrollProgress > 0.38) {
          activeIndex = 1;
        }
        if (scrollProgress > 0.68) {
          activeIndex = 2;
        }
      } else {
        // Desktop transition points
        if (scrollProgress > 0.1) {
          activeIndex = 0;
        }
        if (scrollProgress > 0.43) {
          activeIndex = 1;
        }
        if (scrollProgress > 0.76) {
          activeIndex = 2;
        }
      }
      
      // Only activate if different from current
      const currentActive = Array.from(stepItems).findIndex(item => 
        item.classList.contains('active') || item.classList.contains('initial-active')
      );
      
      if (currentActive !== activeIndex) {
        if (activeIndex >= 0) {
          activateStep(activeIndex);
        } else {
          // Deactivate all steps initially
          stepItems.forEach(item => {
            item.classList.remove('active');
            item.classList.remove('initial-active');
          });
          flowDiagrams.forEach(diagram => diagram.classList.remove('active'));
          stepNumbers.forEach(num => num.classList.remove('active'));
        }
      }
    } else if (wrapperRect.bottom <= 0) {
      // If we've scrolled past the wrapper, ensure the last step is active
      const currentActive = Array.from(stepItems).findIndex(item => 
        item.classList.contains('active') || item.classList.contains('initial-active')
      );
      
      if (currentActive !== 2) {
        activateStep(2);
      }
    }
  }

  // Initialize first step with initial-active class
  stepItems[0].classList.add('initial-active');
  flowDiagrams[0].classList.add('active');
  stepNumbers[0].classList.add('active');

  // Add scroll event listener for automatic transitions
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleScrollBasedTransitions();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true }); // Add passive flag for better mobile performance

  // Handle window resize
  window.addEventListener('resize', () => {
    const activeIndex = Array.from(stepItems).findIndex(item => 
      item.classList.contains('active') || item.classList.contains('initial-active')
    );
    if (activeIndex === -1) {
      // If no step is active, keep the initial state
      stepItems[0].classList.add('initial-active');
      flowDiagrams[0].classList.add('active');
      stepNumbers[0].classList.add('active');
    }
  });
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