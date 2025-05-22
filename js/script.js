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

  document.addEventListener('DOMContentLoaded', function() {
    const thumbnailsTrack = document.getElementById('thumbnailsTrack');
    const totalPhotos = 10;
    let currentIndex = 1;
    let slideshowInterval;
  
    // Generate thumbnails with WebP fallback
    function generateThumbs() {
      thumbnailsTrack.innerHTML = '';
      for (let i = 1; i <= totalPhotos; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item' + (i === 1 ? ' active' : '');
        thumb.innerHTML = `
          <picture>
            <source srcset="img/pw${i}.webp" type="image/webp">
            <source srcset="img/pw${i}.jpg" type="image/jpeg">
            <img src="img/pw${i}.jpg" alt="Wedding Photo ${i}" loading="lazy">
          </picture>
        `;
        thumb.addEventListener('click', () => {
          updateGallery(i);
          resetSlideshow();
        });
        thumbnailsTrack.appendChild(thumb);
      }
    }
  
    // Update gallery display with WebP support
    function updateGallery(index, isAuto = true) {
      currentIndex = index > totalPhotos ? 1 : index < 1 ? totalPhotos : index;
      const mainImageContainer = document.querySelector('.main-image-container');
      
      // Update main image with WebP fallback
      mainImageContainer.innerHTML = `
        <picture>
          <source srcset="img/pw${currentIndex}.webp" type="image/webp">
          <source srcset="img/pw${currentIndex}.jpg" type="image/jpeg">
          <img src="img/pw${currentIndex}.jpg" alt="Wedding Photo ${currentIndex}" 
               class="main-image" id="mainImage" loading="${isAuto ? 'eager' : 'lazy'}">
        </picture>
      `;
      
      // Reassign mainImage reference
      const mainImage = document.getElementById('mainImage');
      
      // Update active thumbnail
      document.querySelectorAll('.thumbnail-item').forEach((t, i) => {
        t.classList.toggle('active', i === currentIndex - 1);
      });
  
      if (!isAuto) {
        const thumbs = document.querySelectorAll('.thumbnail-item');
        if (thumbs[currentIndex - 1]) {
          thumbs[currentIndex - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }
      
      // Reattach swipe events to new image
      attachSwipeEvents(mainImage);
    }
  
    // Attach swipe events to main image
    function attachSwipeEvents(element) {
      let touchStartX = 0;
      element.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });
  
      element.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            updateGallery(currentIndex + 1, false);
          } else {
            updateGallery(currentIndex - 1, false);
          }
          resetSlideshow();
        }
      });
    }
  
    // Start automatic slideshow
    function startSlideshow() {
      slideshowInterval = setInterval(() => {
        updateGallery(currentIndex + 1, true);
      }, 2000); // Change image every 2 seconds
    }
  
    // Reset slideshow timer
    function resetSlideshow() {
      clearInterval(slideshowInterval);
      startSlideshow();
    }
  
    // Navigation arrows
    document.querySelector('.thumb-prev').addEventListener('click', () => {
      updateGallery(currentIndex - 1, false);
      resetSlideshow();
    });
  
    document.querySelector('.thumb-next').addEventListener('click', () => {
      updateGallery(currentIndex + 1, false);
      resetSlideshow();
    });
  
    // Initialize gallery
    generateThumbs();
    updateGallery(1, true);
    startSlideshow();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

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
  