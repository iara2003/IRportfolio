const eye = document.querySelector('.eye');
const iris = document.querySelector('.iris');
const backShadow = document.querySelector('.back-shadow');
const portfolioShadow = document.querySelector('.portfolio-shadow'); // sombra do portfólio

// Variáveis de movimento
let irisTargetX = 0, irisTargetY = 0;
let irisX = 0, irisY = 0;

let shadowTargetX = 0, shadowTargetY = 0;
let shadowX = 0, shadowY = 0;

let portTargetX = 0, portTargetY = 0;
let portX = 0, portY = 0;

// Limites e suavização
const irisMax = 25;
const shadowMax = 12;
const portMax = 15; // movimento leve da sombra
const ease = 0.1;

document.addEventListener('mousemove', (e) => {
    const rect = eye.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Olho
    irisTargetX = Math.max(Math.min(dx / 10, irisMax), -irisMax);
    irisTargetY = Math.max(Math.min(dy / 10, irisMax), -irisMax);

    shadowTargetX = Math.max(Math.min(-dx / 20, shadowMax), -shadowMax);
    shadowTargetY = Math.max(Math.min(-dy / 20, shadowMax), -shadowMax);

    // Sombra do portfólio
    portTargetX = Math.max(Math.min(-dx / 30, portMax), -portMax);
    portTargetY = Math.max(Math.min(-dy / 30, portMax), -portMax);
});

function animate() {
    // Olho
    irisX += (irisTargetX - irisX) * ease;
    irisY += (irisTargetY - irisY) * ease;
    iris.style.transform = `translate(${irisX}px, ${irisY}px)`;

    shadowX += (shadowTargetX - shadowX) * ease;
    shadowY += (shadowTargetY - shadowY) * ease;
    backShadow.style.transform = `translate(${shadowX}px, ${shadowY}px)`;

    // Portfólio shadow
    portX += (portTargetX - portX) * ease;
    portY += (portTargetY - portY) * ease;
    if (portfolioShadow) {
        portfolioShadow.style.transform = `translate(${portX}px, ${portY}px)`;
    }

    requestAnimationFrame(animate);
}

animate();



