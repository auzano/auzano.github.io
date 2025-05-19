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
    const mainImage = document.getElementById('mainImage');
    const thumbnailsTrack = document.getElementById('thumbnailsTrack');
    const totalPhotos = 10;
    let currentIndex = 0;
  
    // Generate thumbnails
    function generateThumbs() {
      thumbnailsTrack.innerHTML = '';
      for (let i = 1; i <= totalPhotos; i++) {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail-item' + (i === 1 ? ' active' : '');
        thumb.innerHTML = `<img src="img/pw${i}.jpg" alt="Wedding Photo ${i}" loading="lazy">`;
        thumb.addEventListener('click', () => updateGallery(i));
        thumbnailsTrack.appendChild(thumb);
      }
    }
  
    // Update gallery display
    function updateGallery(index) {
      currentIndex = index > totalPhotos ? 1 : index < 1 ? totalPhotos : index;
      mainImage.src = `img/pw${currentIndex}.jpg`;
      
      // Update active thumbnail
      document.querySelectorAll('.thumbnail-item').forEach((t, i) => {
        t.classList.toggle('active', i === currentIndex - 1);
      });
      
      // Scroll to thumbnail
      const thumbs = document.querySelectorAll('.thumbnail-item');
      if (thumbs[currentIndex - 1]) {
        thumbs[currentIndex - 1].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
      }
    }
  
    // Navigation arrows with infinite loop
    document.querySelector('.thumb-prev').addEventListener('click', () => {
      updateGallery(currentIndex - 1);
    });
  
    document.querySelector('.thumb-next').addEventListener('click', () => {
      updateGallery(currentIndex + 1);
    });
  
    // Initialize
    generateThumbs();
    mainImage.src = 'img/pw1.jpg';
  
    // Optional: Swipe gestures for mobile
    let touchStartX = 0;
    mainImage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
  
    mainImage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          updateGallery(currentIndex + 1); // Swipe left
        } else {
          updateGallery(currentIndex - 1); // Swipe right
        }
      }
    });
  });