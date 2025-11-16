

const scrollContainer = document.querySelector('.sobremim');
const scrollRightBtn = document.getElementById('scrollRight');

scrollRightBtn.addEventListener('click', () => {
    const sectionWidth = scrollContainer.querySelector('.section').offsetWidth;
    scrollContainer.scrollBy({ left: sectionWidth, behavior: 'smooth' });
});

