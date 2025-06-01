// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    
    // Start fade out after 1.5s (adjust as needed)
    setTimeout(() => {
      preloader.style.opacity = '0';
      
      // Remove after fade completes
      setTimeout(() => {
        preloader.remove();
      }, 800); // Match this with CSS transition duration
    }, 1500);
  });
  
  // Countdown Timer
  document.addEventListener('DOMContentLoaded', function() {
    // Countdown elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Wedding date: June 28, 2025 08:00 WIB (UTC+7)
    const weddingDate = new Date('2025-06-28T01:00:00Z'); // 08:00 WIB in UTC
    
    function updateCountdown() {
      const now = new Date();
      const diff = weddingDate - now;
      
      if (diff <= 0) {
        // If wedding date has passed
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }
      
      // Calculate time units
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Update display
      daysEl.textContent = days.toString().padStart(2, '0');
      hoursEl.textContent = hours.toString().padStart(2, '0');
      minutesEl.textContent = minutes.toString().padStart(2, '0');
      secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
  
    // Initial call and set interval
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });
  
  // Gallery Functionality
  document.addEventListener('DOMContentLoaded', function() {
    const mainImageContainer = document.querySelector('.main-image-container');
    const thumbnailsTrack = document.getElementById('thumbnailsTrack');
    const totalPhotos = 9;
    let currentIndex = 1;
    let slideshowInterval;
    let isWebPSupported = false;
  
    // Function to check WebP support
    async function checkWebPSupport() {
      isWebPSupported = await new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = function() {
          resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    }
  
    // Generate thumbnails
    async function generateThumbs() {
      await checkWebPSupport();
      thumbnailsTrack.innerHTML = '';
      
      for (let i = 1; i <= totalPhotos; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item' + (i === 1 ? ' active' : '');
        
        const picture = document.createElement('picture');
        if (isWebPSupported) {
          const sourceWebP = document.createElement('source');
          sourceWebP.srcset = `img/pw${i}.webp`;
          sourceWebP.type = 'image/webp';
          picture.appendChild(sourceWebP);
        }
        
        const img = document.createElement('img');
        img.src = `img/pw${i}.jpg`;
        img.alt = `Wedding Photo ${i}`;
        img.loading = 'lazy';
        picture.appendChild(img);
        
        thumb.appendChild(picture);
        thumb.addEventListener('click', () => {
          updateGallery(i);
          resetSlideshow();
        });
        thumbnailsTrack.appendChild(thumb);
      }
    }
  
    // Update main image
    async function updateMainImage(index) {
      const picture = document.createElement('picture');
      if (isWebPSupported) {
        const sourceWebP = document.createElement('source');
        sourceWebP.srcset = `img/pw${index}.webp`;
        sourceWebP.type = 'image/webp';
        picture.appendChild(sourceWebP);
      }
      
      const img = document.createElement('img');
      img.src = `img/pw${index}.jpg`;
      img.alt = `Wedding Photo ${index}`;
      img.className = 'main-image';
      
      // Add fade transition
      img.style.opacity = '0';
      picture.appendChild(img);
      mainImageContainer.innerHTML = '';
      mainImageContainer.appendChild(picture);
      
      // Trigger fade in
      setTimeout(() => {
        img.style.opacity = '1';
      }, 10);
    }
  
    // Update gallery
    async function updateGallery(index) {
      currentIndex = index > totalPhotos ? 1 : index < 1 ? totalPhotos : index;
      await updateMainImage(currentIndex);
      
      // Update active thumbnail
      document.querySelectorAll('.thumbnail-item').forEach((t, i) => {
        t.classList.toggle('active', i === currentIndex - 1);
      });
      
      // Smooth scroll to active thumbnail (optional)
      const activeThumb = document.querySelector('.thumbnail-item.active');
      if (activeThumb) {
        const containerWidth = thumbnailsTrack.offsetWidth;
        const thumbPos = activeThumb.offsetLeft;
        const thumbWidth = activeThumb.offsetWidth;
        const scrollPos = thumbPos - (containerWidth / 2) + (thumbWidth / 2);
        
        thumbnailsTrack.scrollTo({
          left: scrollPos,
          behavior: 'smooth'
        });
      }
    }
  
    // Slideshow auto change
    function startSlideshow() {
      slideshowInterval = setInterval(() => {
        updateGallery(currentIndex + 1);
      }, 3000);
    }
    
    function resetSlideshow() {
      clearInterval(slideshowInterval);
      startSlideshow();
    }
  
    // Swipe gesture for mobile
    let touchStartX = 0;
    mainImageContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
  
    mainImageContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          updateGallery(currentIndex + 1);
        } else {
          updateGallery(currentIndex - 1);
        }
        resetSlideshow();
      }
    });
  
    // Initialize gallery
    async function initGallery() {
      await generateThumbs();
      await updateGallery(1);
      startSlideshow();
    }
  
    initGallery();
  });
  
  // Audio Player
  document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('bgMusic');
    const vinyl = document.getElementById('vinylBtn');
    let isPlaying = false;
    
    // Optimasi preload audio
    audio.preload = 'auto';
    audio.load(); // Paksa browser mulai mengunduh audio
    
    // Ganti ke vinyl diam (jika ada)
    function setVinylPaused() {
      vinyl.src = 'img/vinyl4.png';
    }
  
    function setVinylPlaying() {
      vinyl.src = 'img/vinyl4.gif';
    }
  
    // Fungsi untuk mencoba memutar audio
    function tryPlayAudio() {
      audio.play()
        .then(() => {
          isPlaying = true;
          setVinylPlaying();
          window.removeEventListener('scroll', handleFirstScroll); // Hapus listener setelah berhasil
        })
        .catch(error => {
          console.log('Autoplay blocked, waiting for user interaction:', error);
        });
    }
  
    // Handler untuk scroll pertama
    function handleFirstScroll() {
      if (!isPlaying) {
        tryPlayAudio();
      }
    }
  
    // Coba autoplay saat audio sudah siap
    audio.addEventListener('canplaythrough', tryPlayAudio);
    
    // Setup scroll listener dengan throttling
    let scrollTimer;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleFirstScroll, 200); // Tunggu 200ms setelah scroll berhenti
    }, { passive: true });
  
    // Toggle play/pause saat vinyl diklik
    vinyl.addEventListener('click', function() {
      if (isPlaying) {
        audio.pause();
        setVinylPaused();
      } else {
        audio.play()
          .then(() => setVinylPlaying())
          .catch(error => console.log('Play failed:', error));
      }
      isPlaying = !isPlaying;
    });
  
    // Fallback: coba lagi setelah 3 detik jika belum berhasil
    setTimeout(tryPlayAudio, 3000);
  });


  // Scroll Animation Simple
document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= window.innerHeight * 0.8;
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Inisialisasi pertama
    handleScrollAnimation();
    
    // Event listener
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
});

// hover rekening
document.querySelectorAll('.copyable').forEach(element => {
    element.addEventListener('click', function() {
        const accountNumber = this.getAttribute('data-account');
        navigator.clipboard.writeText(accountNumber).then(() => {
            // Ubah warna sementara saat berhasil dicopy
            const originalColor = this.style.color;
            this.style.color = '#977676';
            setTimeout(() => {
                this.style.color = originalColor;
            }, 500);
        });
    });
    
    // Tambahkan cursor pointer dan efek hover
    element.style.cursor = 'pointer';
    element.addEventListener('mouseover', function() {
        this.style.color = '#977676';
    });
    element.addEventListener('mouseout', function() {
        this.style.color = '#ffffff';
    });
});