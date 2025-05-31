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

  // start of gallery 

  document.addEventListener('DOMContentLoaded', function() {
    const mainImageContainer = document.querySelector('.main-image-container');
    const thumbnailsTrack = document.getElementById('thumbnailsTrack');
    const totalPhotos = 10;
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
  // end of gallery 

  document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('bgMusic');
    const vinyl = document.getElementById('vinylBtn');
    let isPlaying = false;
  
    // Ganti ke vinyl diam (jika ada)
    function setVinylPaused() {
      vinyl.src = 'img/vinyl4.png'; // Ganti ke gambar diam
    }
  
    function setVinylPlaying() {
      vinyl.src = 'img/vinyl4.gif'; // Ganti ke gif muter
    }
  
    // Play saat mulai scroll (hanya sekali)
    let hasInteracted = false;
    window.addEventListener('scroll', function () {
      if (!hasInteracted) {
        audio.play().then(() => {
          isPlaying = true;
          setVinylPlaying();
          hasInteracted = true;
        }).catch(() => {
          // autoplay mungkin diblokir, user harus klik
        });
      }
    });
  
    // Toggle play/pause saat vinyl diklik
    vinyl.addEventListener('click', function () {
      if (isPlaying) {
        audio.pause();
        setVinylPaused();
      } else {
        audio.play().then(() => {
          setVinylPlaying();
        });
      }
      isPlaying = !isPlaying;
    });
  });
  