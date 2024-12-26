// Select all elements with the class "hidden"
const hiddenElements = document.querySelectorAll('.hidden');

// Create an Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add "visible" class when in viewport
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, {
    threshold: 0.5 // Trigger when 20% of the element is visible
});

// Observe each hidden element
hiddenElements.forEach(element => {
    observer.observe(element);
});
