const icons = document.querySelectorAll('.icon');
const windows = document.querySelectorAll('.window');
const rightArea = document.querySelector('.dynamic-right');
const preview = document.getElementById('preview');

// Cria camada transparente para efeitos
const overlay = document.createElement('div');
overlay.classList.add('dynamic-overlay');
rightArea.appendChild(overlay);

// Apenas transição de opacidade para suavizar entrada/saída
overlay.style.transition = 'opacity 0.4s ease';
overlay.style.opacity = 0;
overlay.style.backdropFilter = 'blur(0.1px)';
overlay.style.filter = 'none';

let activeSection = null; // pasta atualmente ativa

// Função para aplicar efeitos instantâneos
function applyVisualEffect(section) {
  overlay.style.opacity = 1; // fade in

  switch (section) {
    case 'webdesign':
      overlay.style.backdropFilter = 'blur(6px) brightness(1)';
      overlay.style.filter = 'saturate(1.5) contrast(1.1)';
      overlay.style.backgroundImage = '';
      break;
    case '3d':
      overlay.style.backdropFilter = 'blur(6px) contrast(1.2)';
      overlay.style.filter = 'invert(1) hue-rotate(180deg) saturate(1.2)';
      overlay.style.backgroundImage = '';
      break;
    case 'video':
      overlay.style.backdropFilter = 'blur(6px) brightness(1.1)';
      overlay.style.filter = 'grayscale(1) contrast(1.2)';
      overlay.style.backgroundImage = 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)';
      overlay.style.backgroundSize = '2px 2px';
      break;
    case 'design':
      overlay.style.backdropFilter = 'blur(6px) contrast(2)';
      overlay.style.filter = 'invert(1) brightness(0.7)';
      overlay.style.backgroundImage = '';
      break;
    case 'foto':
      overlay.style.backdropFilter = 'blur(6px) brightness(1.1)';
      overlay.style.filter = 'sepia(1) contrast(1.3)';
      overlay.style.backgroundImage = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)';
      overlay.style.backgroundSize = '3px 3px';
      break;
    default:
      break;
  }
}

// Função para resetar efeitos suavemente
function resetVisualEffect() {
  overlay.style.opacity = 0; // fade out
}

// Hover temporário
icons.forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    if (!activeSection) {
      const section = icon.dataset.section;
      applyVisualEffect(section);
    }
    preview.textContent = '';
    preview.style.opacity = 0;
  });

  icon.addEventListener('mouseleave', () => {
    if (!activeSection) {
      resetVisualEffect(); // fade out suave
    }
  });

  icon.addEventListener('click', () => {
    const section = icon.dataset.section;
    activeSection = section; // pasta ativa
    applyVisualEffect(section);
  });
});

// Abrir pastas (janela) com animação de saída da anterior
icons.forEach(icon => {
  icon.addEventListener('click', () => {
    const target = icon.dataset.window;
    const win = document.getElementById(`window-${target}`);

    // Verifica se há uma janela aberta diferente
    const openWindow = Array.from(windows).find(w => w.classList.contains('show') && w !== win);

    if (openWindow) {
      // Fecha janela anterior com animação
      openWindow.classList.remove('show');
      openWindow.classList.add('hide');

      setTimeout(() => {
        openWindow.style.display = 'none';

        // Abre a nova janela
        win.classList.remove('hide');
        win.classList.add('show');
        win.style.display = 'flex';
        win.style.width = '75vw';
        win.style.height = '90vh';
        win.style.top = '5vh';
        win.style.left = '25vw';
      }, 300); // espera 300ms pela animação de saída
    } else {
      // Se não houver janela aberta, abre imediatamente
      win.classList.remove('hide');
      win.classList.add('show');
      win.style.display = 'flex';
      win.style.width = '75vw';
      win.style.height = '90vh';
      win.style.top = '5vh';
      win.style.left = '25vw';
    }
  });
});


// ===== REINICIAR JANELAS AO CLICAR NOVAMENTE NO ÍCONE =====
icons.forEach(icon => {
  icon.addEventListener('click', () => {
    const target = icon.dataset.window;
    const win = document.getElementById(`window-${target}`);

    if (win.classList.contains('show')) {
      // Reinicia comportamentos específicos por tipo de janela
      if (target === 'fotografia') {
        // Voltar à página inicial (categorias)
        const categorias = win.querySelector('.painel-categorias');
        const galerias = win.querySelectorAll('.painel-galeria');
        galerias.forEach(g => g.classList.remove('active'));
        categorias.classList.add('active');
      }

      // Aqui podes adicionar outros resets:
      // if (target === 'design') { ... }
      // if (target === '3d') { ... }

      // Faz um pequeno efeito de "piscar" para mostrar que reiniciou
      win.classList.add('reset-flash');
      setTimeout(() => win.classList.remove('reset-flash'), 400);
    }
  });
});


// Controle das janelas
windows.forEach(win => {
  const closeBtn = win.querySelector('.close');
  const minimizeBtn = win.querySelector('.minimize');
  const maximizeBtn = win.querySelector('.maximize');
  const titleBar = win.querySelector('.title-bar');

  // Fechar janela
  closeBtn.addEventListener('click', () => {
    win.classList.remove('show');
    win.classList.add('hide');
    setTimeout(() => (win.style.display = 'none'), 300);

    const icon = document.querySelector(`.icon[data-window="${win.id.replace('window-', '')}"]`);
    if (icon && activeSection === icon.dataset.section) {
      activeSection = null;
      resetVisualEffect();
    }
  });

  // Minimizar → fecha janela
  minimizeBtn.addEventListener('click', () => {
    win.classList.remove('show');
    win.classList.add('hide');
    setTimeout(() => (win.style.display = 'none'), 300);

    const icon = document.querySelector(`.icon[data-window="${win.id.replace('window-', '')}"]`);
    if (icon && activeSection === icon.dataset.section) {
      activeSection = null;
      resetVisualEffect();
    }
  });

  // Desativa maximizar
  maximizeBtn.style.opacity = "0.5";
  maximizeBtn.style.cursor = "default";
  maximizeBtn.disabled = true;

  // Arrastar janelas
  let isDragging = false;
  let offsetX, offsetY;

  titleBar.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = 200;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = 'auto';
  });

  document.addEventListener('mousemove', e => {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  });
});

// ====== CENA 3D INTERATIVA ======
if (document.querySelector('#three-container')) {
  import('https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js').then(async (THREE) => {
    const { OrbitControls } = await import('https://cdn.jsdelivr.net/npm/three@0.164/examples/jsm/controls/OrbitControls.js');
    const { GLTFLoader } = await import('https://cdn.jsdelivr.net/npm/three@0.164/examples/jsm/loaders/GLTFLoader.js');

    const container = document.getElementById('three-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 1, 8);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 10, 5);
    scene.add(ambientLight, spotLight);

    // Wireframe room
    const room = new THREE.BoxGeometry(10, 6, 10);
    const wireframe = new THREE.WireframeGeometry(room);
    const line = new THREE.LineSegments(
      wireframe,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
    );
    scene.add(line);

    // Loader de modelos GLB locais
    const loader = new GLTFLoader();

    const modelos = [
      { path: 'assets/modelos/model1.glb', pos: [-2, -1, 0], scale: 0.7 },
      { path: 'assets/modelos/model2.glb', pos: [2, -1, -1], scale: 0.6 },
      { path: 'assets/modelos/model3.glb', pos: [0, -1, 2], scale: 0.8 }
    ];

    modelos.forEach((m, i) => {
      loader.load(
        m.path,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(...m.pos);
          model.scale.set(m.scale, m.scale, m.scale);
          model.name = `model${i}`;
          scene.add(model);
        },
        undefined,
        (err) => console.error(`Erro ao carregar ${m.path}`, err)
      );
    });

    // Planos com imagens 2D
    const imagens = [
      { path: 'assets/preview1.jpg', pos: [0, 1, -4], rotY: 0 },
      { path: 'assets/preview2.jpg', pos: [-4, 1, 0], rotY: Math.PI / 2 },
      { path: 'assets/preview3.jpg', pos: [4, 1, 0], rotY: -Math.PI / 2 }
    ];

    imagens.forEach((img) => {
      const texture = new THREE.TextureLoader().load(img.path);
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 2),
        new THREE.MeshBasicMaterial({ map: texture })
      );
      plane.position.set(...img.pos);
      plane.rotation.y = img.rotY;
      scene.add(plane);
    });

    // Loop de animação
    function animate() {
      requestAnimationFrame(animate);
      scene.traverse((obj) => {
        if (obj.name.includes('model')) obj.rotation.y += 0.005;
      });
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Responsivo
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  });
}

// ... (todo o teu código anterior até ao final da secção do botão "3D") ...

// Impedir que o botão "3D" abra também a galeria
document.querySelectorAll('.link-3d-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // bloqueia o clique de propagar para o item pai
  });
});

// === MODAL DE IMAGENS GLOBAL (3D + FOTOGRAFIA) === //
const modal = document.getElementById('modal-viewer');
const modalImg = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');
const prevBtn = document.getElementById('prev-img');
const nextBtn = document.getElementById('next-img');

let currentIndex = 0;
let currentList = [];

// --- Galeria do 3D (imagens .floating-item.clickable) ---
const clickableItems = document.querySelectorAll('.floating-item.clickable');
const clickableImages = Array.from(clickableItems).map(item => item.querySelector('img').src);

clickableItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentList = clickableImages;
    currentIndex = index;
    openModal(currentList[currentIndex]);
  });
});

// --- Galeria de Fotografia (apenas dentro da categoria clicada) ---
document.querySelectorAll('.masonry-gallery .masonry-item img').forEach(img => {
  img.addEventListener('click', () => {
    // identifica a galeria (categoria) onde a imagem está
    const gallery = img.closest('.masonry-gallery');
    const imgsInGallery = Array.from(gallery.querySelectorAll('img'));

    currentList = imgsInGallery.map(i => i.src);
    currentIndex = imgsInGallery.indexOf(img);

    openModal(currentList[currentIndex]);
  });
});

// --- Funções do modal ---
function openModal(src) {
  modalImg.src = src;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function showPrevImg() {
  if (!currentList.length) return;
  currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
  modalImg.src = currentList[currentIndex];
}

function showNextImg() {
  if (!currentList.length) return;
  currentIndex = (currentIndex + 1) % currentList.length;
  modalImg.src = currentList[currentIndex];
}

closeModal.addEventListener('click', closeModalFunc);
prevBtn.addEventListener('click', showPrevImg);
nextBtn.addEventListener('click', showNextImg);

// Fecha modal clicando fora da imagem
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModalFunc();
});

// === NAVEGAÇÃO ENTRE CATEGORIAS DE FOTOGRAFIA === //
const categorias = document.querySelector('.painel-categorias');
const galerias = document.querySelectorAll('.painel-galeria');

// abrir galeria ao clicar numa categoria
document.querySelectorAll('.painel-categorias .painel').forEach(painel => {
  painel.addEventListener('click', () => {
    const target = painel.dataset.section;
    // esconder categorias
    categorias.classList.remove('active');
    // esconder todas as galerias
    galerias.forEach(g => g.classList.remove('active'));
    // mostrar só a galeria correspondente
    const galeriaTarget = document.querySelector(`#galeria-${target}`);
    if (galeriaTarget) galeriaTarget.classList.add('active');
  });
});

// botão voltar
document.querySelectorAll('.voltar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    galerias.forEach(g => g.classList.remove('active'));
    categorias.classList.add('active');
  });
});
