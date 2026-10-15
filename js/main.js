// Smart Electric · Catálogo de Servicios 2026
(function () {
  // Menú móvil
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  const usoIcono = btn.querySelector('use');
  function cerrarMenu() {
    nav.classList.remove('abierto');
    btn.setAttribute('aria-expanded', 'false');
    usoIcono.setAttribute('href', '#i-menu');
  }
  btn.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', String(abierto));
    usoIcono.setAttribute('href', abierto ? '#i-cerrar' : '#i-menu');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));

  // Resaltar sección activa en el menú
  const enlaces = [...nav.querySelectorAll('a[href^="#"]')];
  const secciones = enlaces.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(s => spy.observe(s));

    // Animación de aparición
    const rev = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visto'); rev.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.revelar').forEach(el => rev.observe(el));
  } else {
    document.querySelectorAll('.revelar').forEach(el => el.classList.add('visto'));
  }

  // Página ficticia: los botones que llevarían fuera de la página (WhatsApp,
  // llamadas, correo y sitio web) solo muestran un aviso
  const ACCIONES = {
    whatsapp: { icono: 'i-whatsapp', texto: 'no te llevará a WhatsApp' },
    llamada:  { icono: 'i-telefono', texto: 'no realizará ninguna llamada' },
    correo:   { icono: 'i-correo',   texto: 'no abrirá tu correo' },
    web:      { icono: 'i-web',      texto: 'no te llevará a otra página' }
  };
  const modal = document.createElement('div');
  modal.className = 'modal-ficticia';
  modal.hidden = true;
  modal.innerHTML =
    '<div class="modal-caja" role="alertdialog" aria-modal="true" aria-labelledby="modal-titulo" aria-describedby="modal-texto">' +
      '<span class="modal-icono"><svg class="icono"><use href="#i-whatsapp"/></svg></span>' +
      '<h3 id="modal-titulo">Acción de prueba</h3>' +
      '<p id="modal-texto"></p>' +
      '<button type="button" class="btn btn--negro modal-cerrar">Entendido</button>' +
    '</div>';
  document.body.appendChild(modal);
  const botonCerrar = modal.querySelector('.modal-cerrar');
  const iconoModal = modal.querySelector('.modal-icono use');
  const textoModal = modal.querySelector('#modal-texto');
  let origen = null;

  function abrirModal(desde) {
    const accion = ACCIONES[desde.dataset.accion] || ACCIONES.web;
    iconoModal.setAttribute('href', '#' + accion.icono);
    textoModal.textContent = 'Esta página es ficticia y se usa solo como prueba. Este botón ' + accion.texto + '.';
    origen = desde;
    modal.hidden = false;
    void modal.offsetWidth; // fuerza el render para que se vea la transición
    modal.classList.add('abierto');
    botonCerrar.focus();
  }
  function cerrarModal() {
    modal.classList.remove('abierto');
    modal.hidden = true;
    if (origen) origen.focus();
  }
  botonCerrar.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) cerrarModal(); });

  document.addEventListener('click', e => {
    const boton = e.target.closest('[data-accion]');
    if (!boton) return;
    e.preventDefault();
    abrirModal(boton);
  });
})();
