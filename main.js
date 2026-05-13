/* ══════════════════════════════════════════════
   VISUM – MEDICINA OCULAR  |  main.js
   ══════════════════════════════════════════════ */

// ─── EMAILJS INIT ───────────────────────────
(function () {
  emailjs.init("AnKHWK_DxGqgbChjb");
})();

// ─── NAVBAR SCROLL ───────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── MOBILE HAMBURGER ────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navSubmenus = [
  { dropdown: document.querySelector('.nav-dropdown--patologias'), toggle: document.getElementById('nav-patologias-toggle') },
  { dropdown: document.querySelector('.nav-dropdown--servicios'), toggle: document.getElementById('nav-servicios-toggle') },
  { dropdown: document.querySelector('.nav-dropdown--paciente'), toggle: document.getElementById('nav-paciente-toggle') }
];

function closeAllNavSubmenus() {
  navSubmenus.forEach(({ dropdown, toggle }) => {
    dropdown?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
}

function setupNavSubmenuToggle(dropdown, toggle) {
  if (!dropdown || !toggle) return;
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wasOpen = dropdown.classList.contains('is-open');
    closeAllNavSubmenus();
    if (!wasOpen) {
      dropdown.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
}

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  document.body.classList.toggle('nav-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (!open) closeAllNavSubmenus();
});
navLinks.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  });
});

navSubmenus.forEach(({ dropdown, toggle }) => setupNavSubmenuToggle(dropdown, toggle));

navLinks.querySelectorAll('.nav-dropdown .dropdown-content a').forEach(link => {
  link.addEventListener('click', () => {
    closeAllNavSubmenus();
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    closeAllNavSubmenus();
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  }
});

// ─── SCROLL REVEAL ──────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => el.classList.add('visible'), el.dataset.delay || 0);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Stagger sibling cards
    const parent = el.closest('.services-grid, .patologias-grid, .test-grid, .about-pillars, .tech-list, .contact-details');
    if (parent) {
      const siblings = parent.querySelectorAll(':scope > .reveal, :scope > div > .reveal');
      const idx = [...siblings].indexOf(el);
      el.dataset.delay = idx * 90;
    }
    observer.observe(el);
  });
}
initReveal();

// ─── COUNTER ANIMATION ──────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 2200;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('es-CO');
  }, step);
}

const statsSection = document.getElementById('hero-stats');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
if (statsSection) statsObserver.observe(statsSection);

// ─── SMOOTH ACTIVE NAV LINK ─────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  navLinkEls.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'white'
      : '';
    link.style.background = link.getAttribute('href') === `#${current}`
      ? 'rgba(255,255,255,0.12)'
      : '';
  });
};
window.addEventListener('scroll', activateNav, { passive: true });

// ─── PARALLAX HERO ──────────────────────────
const heroImg = document.getElementById('hero-img');
window.addEventListener('scroll', () => {
  if (heroImg && window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });

// ─── FORM SUBMISSION ────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit');
  const text = document.getElementById('btn-submit-text');
  const icon = document.getElementById('btn-submit-icon');

  btn.disabled = true;
  text.textContent = 'Enviando...';
  icon.textContent = '⏳';

  emailjs.sendForm('service_eletrff', 'template_e6p7wua', e.target)
    .then(() => {
      document.getElementById('contact-form').classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
    }, (error) => {
      console.log('FAILED...', error);
      alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctanos por teléfono.');
      btn.disabled = false;
      text.textContent = 'Enviar Solicitud';
      icon.textContent = '→';
    });
}

function resetForm() {
  document.getElementById('contact-form').reset();
  document.getElementById('contact-form').classList.remove('hidden');
  document.getElementById('form-success').classList.add('hidden');
  const btn = document.getElementById('btn-submit');
  document.getElementById('btn-submit-text').textContent = 'Enviar Solicitud';
  document.getElementById('btn-submit-icon').textContent = '→';
  btn.disabled = false;
}

// ─── SERVICE CARD HOVER TILT ────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── TECH ITEMS ENTRY STAGGER ───────────────
document.querySelectorAll('.tech-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.08}s`;
});

// ─── DOCTORS DIRECTORY FILTERING ────────────
const searchInput = document.getElementById('doctor-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const doctorCards = document.querySelectorAll('.doctor-card');

function filterDoctors() {
  const searchTerm = searchInput.value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

  doctorCards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const specs = card.dataset.specialties.toLowerCase();
    const matchesSearch = name.includes(searchTerm) || specs.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || specs.includes(activeFilter);

    if (matchesSearch && matchesFilter) {
      card.classList.remove('hidden-doctor');
      // Re-trigger reveal animation check
      card.classList.add('visible');
    } else {
      card.classList.add('hidden-doctor');
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterDoctors);
}

if (filterBtns) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterDoctors();
    });
  });
}


// ─── END OF LEGACY DATA CLEANUP ─────────────


// ─── DOCTOR DATA ────────────────────────────
const doctorsData = {
  'dr-hermosilla': {
    name: 'Dr. Victor Hermosilla Bucarey',
    title: 'Especialista en Córnea y Cirugía Refractiva',
    img: 'https://www.visum.cl/content/uploads/2020/04/8.png',
    bio: 'Médico Cirujano Universidad Austral. Especialidad en Oftalmología, Universidad de Chile. Miembro de la Sociedad Chilena de Oftalmología.',
    education: [
      'Postgrado en Segmento Anterior y Especialidad en Córnea, Universidad de Chile.',
      'Diplomado en Metodología de la Investigación Clínica, Universidad de Chile.',
      'Diplomado en Gestión de Instituciones de Salud, Universidad de Chile.'
    ],
    experience: [
      'Médico Oftalmólogo de planta en Hospital del Salvador.',
      'Docente de Postgrado de Oftalmología, Universidad de Chile.'
    ]
  },
  'dr-carvallo': {
    name: 'Dr. Alejandro Carvallo Velasco',
    title: 'Especialista en Córnea y Cirugía Plástica Ocular',
    img: 'https://www.visum.cl/content/uploads/2020/04/1.png',
    bio: 'Médico Cirujano Universidad de Chile. Especialidad en Oftalmología, Universidad de Chile. Experto en cirugía reconstructiva y estética ocular.',
    education: [
      'Postgrado en Segmento Anterior y Córnea, Hospital del Salvador, Universidad de Chile.',
      'Postgrado en Cirugía Plástica Ocular, Hospital del Salvador, Universidad de Chile.'
    ],
    experience: [
      'Especialista en Órbita y Oculoplastía.',
      'Miembro de la Sociedad Chilena de Oftalmología.'
    ]
  },
  'dr-fanjul': {
    name: 'Dr. Rodrigo Fanjul Dominguez',
    title: 'Especialista en Glaucoma y Queratocono',
    img: 'https://www.visum.cl/content/uploads/2020/05/6.png',
    bio: 'Médico Cirujano, Universidad de Valparaíso. Especialidad en Oftalmología, Universidad de Chile. Especialista en diagnóstico avanzado de glaucoma.',
    education: [
      'Perfeccionamiento en Glaucoma, Hospital Clínico Universidad de Chile (HCUCH).',
      'Especialista en Segmento Anterior y Microcirugía de Catarata.'
    ],
    experience: [
      'Ex-médico de planta en prestigiosas instituciones de salud pública y privada.'
    ]
  },
  'dr-prado': {
    name: 'Dr. Eduardo Prado Jeanront',
    title: 'Especialista en Cirugía Oculoplástica',
    img: 'https://www.visum.cl/content/uploads/2020/05/web-rect-DR-PRADO-2.jpg',
    bio: 'Especialista en cirugía plástica y reconstructiva ocular, así como en procedimientos refractivos de alta precisión.',
    education: [
      'Título de Médico Cirujano.',
      'Especialidad en Oftalmología certificada por CONACEM.'
    ],
    experience: [
      'Amplia trayectoria en cirugía reconstructiva de párpados y vías lagrimales.'
    ]
  },
  'dr-alvarez': {
    name: 'Dr. Rodrigo Álvarez Odone',
    title: 'Especialista en Oculoplástica y Cataratas',
    img: 'https://www.visum.cl/content/uploads/2020/05/visum-doctor.jpg',
    bio: 'Amplia experiencia en cirugía de cataratas y procedimientos de rejuvenecimiento periocular y reconstructivo.',
    education: [
      'Especialista en Oftalmología con enfoque en Segmento Anterior.',
      'Entrenamiento avanzado en Técnicas Oculoplásticas.'
    ],
    experience: [
      'Médico consultor en patologías del párpado y órbita.'
    ]
  },
  'dra-rao': {
    name: 'Dra. Xi Rao',
    title: 'Especialista en Oftalmología General',
    img: 'https://www.visum.cl/content/uploads/2020/04/figure7.png',
    bio: 'Dedicada al diagnóstico integral y seguimiento de la salud visual en adultos y controles preventivos.',
    education: [
      'Médico Cirujano con distinción máxima.',
      'Especialidad en Oftalmología Clínica.'
    ],
    experience: [
      'Control de salud visual y patologías oftalmológicas de baja y mediana complejidad.'
    ]
  },
  'dr-mayora': {
    name: 'Dr. Jaime Mayora Espinoza',
    title: 'Especialista en Retina y Vítreo',
    img: 'https://www.visum.cl/content/uploads/2020/05/7.png',
    bio: 'Experto en cirugía vitreorretinal y tratamiento de enfermedades complejas de la retina y mácula.',
    education: [
      'Subespecialidad en Retina Médica y Quirúrgica.',
      'Entrenamiento en centros de alta complejidad oftalmológica.'
    ],
    experience: [
      'Manejo de trauma ocular y desprendimiento de retina.'
    ]
  },
  'dr-riesco': {
    name: 'Dr. Benjamín Riesco Urrejola',
    title: 'Especialista en Cirugía de Párpados y Órbita',
    img: 'https://www.visum.cl/content/uploads/2021/01/4.png',
    bio: 'Especializado en cirugía de vía lagrimal y estética facial avanzada con un enfoque mínimamente invasivo.',
    education: [
      'Postgrado en Cirugía de Órbita, Párpados y Vías Lagrimales.',
      'Certificación internacional en procedimientos estéticos oculares.'
    ],
    experience: [
      'Especialista referente en Oculoplastía.'
    ]
  },
  'dr-fau': {
    name: 'Dr. Christian Fau Fuentes',
    title: 'Especialista en Glaucoma y Cirugía de Cataratas',
    img: 'https://www.visum.cl/content/uploads/2021/01/3.png',
    bio: 'Médico Cirujano Universidad de Chile. Especialidad en Oftalmología, Universidad de Chile. Amplia trayectoria en el manejo médico y quirúrgico del glaucoma.',
    education: [
      'Fellowship en Glaucoma, Universidad de Chile.',
      'Especialista en Microcirugía de Segmento Anterior.'
    ],
    experience: [
      'Miembro activo de la Sociedad Chilena de Oftalmología.'
    ]
  },
  'dr-munoz': {
    name: 'Dr. Eduardo Muñoz Merello',
    title: 'Especialista en Cataratas y Glaucoma',
    img: 'https://www.visum.cl/content/uploads/2021/01/5.png',
    bio: 'Especialista en microcirugía de cataratas y tratamiento de patologías oculares en adultos mayores.',
    education: [
      'Título de Médico Cirujano.',
      'Especialista en Oftalmología.'
    ],
    experience: [
      'Enfoque en salud visual integral para el adulto mayor.'
    ]
  },
  'dra-herrera': {
    name: 'Dra. Lorena Herrera Tourrel',
    title: 'Especialista en Oftalmopediatría y Estrabismo',
    img: 'https://www.visum.cl/content/uploads/2021/01/dralorenah2.jpg',
    bio: 'Dedicada a la salud visual infantil y al tratamiento quirúrgico y no quirúrgico del estrabismo en niños y adultos.',
    education: [
      'Subespecialidad en Oftalmología Pediátrica.',
      'Experta en estrabismo complejo.'
    ],
    experience: [
      'Reconocida trayectoria en el manejo de visión infantil.'
    ]
  },
  'dr-miranda': {
    name: 'Dra. Karin Miranda',
    title: 'Especialista en Oftalmología General',
    img: 'https://www.visum.cl/content/uploads/2020/05/visum-doctor.jpg',
    bio: 'Médico Cirujano con amplia trayectoria en el diagnóstico y tratamiento integral de patologías oculares, dedicada a la prevención y salud visual de sus pacientes.',
    education: [
      'Médico Cirujano, Universidad de Chile.',
      'Especialidad en Oftalmología.'
    ],
    experience: [
      'Atención integral de adultos y niños.',
      'Control preventivo y patologías oftalmológicas comunes.'
    ]
  }
};

// ─── PACIENTE INFO DATA ──────────────────────
const pacienteInfoData = {
  'agendar': {
    title: 'Agendar Hora',
    desc: 'Ponemos a su disposición múltiples canales para agendar su cita de la manera más cómoda para usted.',
    details: [
      'Reserva en línea a través de nuestra plataforma 24/7.',
      'Contacto directo vía WhatsApp para agendamiento rápido.',
      'Atención telefónica personalizada de Lunes a Viernes.',
      'Recordatorios de cita automáticos vía SMS o correo.'
    ]
  },
  'presupuesto': {
    title: 'Presupuesto',
    desc: 'Solicite un presupuesto detallado para sus procedimientos quirúrgicos o exámenes diagnósticos.',
    details: [
      'Presupuestos transparentes sin costos extra.',
      'Detalle de insumos, honorarios médicos y derechos de sala.',
      'Opciones de financiamiento y facilidades de pago.',
      'Vigencia de presupuestos por 30 días.'
    ]
  },
  'pagos': {
    title: 'Medios de Pago',
    desc: 'Ofrecemos diversas alternativas para facilitar el pago de sus prestaciones médicas.',
    details: [
      'Tarjetas de Crédito y Débito (Webpay/Transbank).',
      'Transferencia electrónica bancaria.',
      'Efectivo directamente en nuestras sucursales.',
      'Convenios vigentes con Isapres y Fonasa (según prestación).'
    ]
  },
  'convenios': {
    title: 'Convenios y Seguros',
    desc: 'Contamos con convenios vigentes con las principales Isapres y fondos de salud del país.',
    details: [
      'Atención mediante bonos I-Med (Isapres y Fonasa).',
      'Convenios con seguros complementarios de salud.',
      'Descuentos especiales para convenios corporativos.',
      'Presupuestos preferenciales para pacientes en convenio.'
    ]
  },
  'quirurgica': {
    title: 'Información Quirúrgica',
    desc: 'Guía básica para pacientes que se someterán a procedimientos quirúrgicos en nuestra clínica.',
    details: [
      'Traer carnet físico vigente',
      'Orden médica del especialista',
      'Venir con un acompañante',
      'Mínimo 6 horas de ayuno o según recomendación del especialista'
    ]
  },
  'derechos': {
    title: 'Derechos y Deberes',
    desc: 'Conozca el marco legal y ético que rige la relación entre el paciente y nuestro equipo de salud.',
    details: [
      'Derecho a recibir una atención digna y de calidad.',
      'Derecho a la privacidad de sus datos y confidencialidad médica.',
      'Deber de entregar información veraz sobre su estado de salud.',
      'Deber de tratar con respeto al personal de la institución.'
    ]
  },
  'reclamos': {
    title: 'Reclamos y Sugerencias',
    desc: 'Su opinión nos ayuda a mejorar continuamente nuestros estándares de servicio.',
    details: [
      'Buzón de sugerencias digital y presencial.',
      'Procedimiento formal de gestión de reclamos.',
      'Tiempos de respuesta garantizados por la dirección climica.',
      'Encuestas de satisfacción post-atención.'
    ]
  },
  'testimonios': {
    title: 'Testimonios',
    desc: 'Historias reales de pacientes que han recuperado su calidad de vida tras tratarse en Visum.',
    details: [
      'Casos de éxito en cirugía refractiva y cataratas.',
      'Experiencias de pacientes en tratamiento de glaucoma.',
      'Reseñas certificadas sobre la atención del equipo médico.',
      'Videos testimoniales sobre el impacto de recuperar la visión.'
    ]
  },
  'examenes': {
    title: 'Exámenes Pre operatorios',
    desc: 'Realizamos todos los estudios necesarios para garantizar la seguridad y precisión de su procedimiento quirúrgico.',
    details: [
      'Topografía Corneal de alta resolución.',
      'Biometría óptica IOL Master.',
      'Microscopía Especular.',
      'Paquimetría Ultrasónica.'
    ]
  },
  'consultas': {
    title: 'Consultas Médicas',
    desc: 'Atención oftalmológica integral con especialistas de primer nivel.',
    details: [
      'Evaluación refractiva completa.',
      'Examen de fondo de ojo.',
      'Medición de presión intraocular.',
      'Receta para lentes y certificados médicos.'
    ]
  },
  'privacidad': {
    title: 'Política de Privacidad',
    desc: 'En Visum, la confidencialidad de su información es nuestra prioridad. Cumplimos con los más altos estándares de protección de datos personales.',
    details: [
      'Resguardo estricto de su ficha clínica electrónica.',
      'Uso de datos exclusivamente para fines médicos y administrativos.',
      'Derecho de acceso, rectificación y cancelación de sus datos.',
      'Protocolos de ciberseguridad avanzada en nuestros sistemas.'
    ]
  },
  'terminos': {
    title: 'Términos de Uso',
    desc: 'Al utilizar nuestros servicios y plataforma digital, usted acepta los términos y condiciones diseñados para garantizar una atención segura y eficiente.',
    details: [
      'Compromiso de entrega de información veraz por parte del paciente.',
      'Propiedad intelectual de los contenidos del sitio web.',
      'Limitaciones de responsabilidad sobre enlaces externos.',
      'Condiciones de uso de la plataforma de agendamiento en línea.'
    ]
  },
  'consentimiento': {
    title: 'Consentimiento Informado',
    desc: 'Garantizamos que cada paciente reciba información clara y detallada antes de cualquier procedimiento médico o quirúrgico.',
    details: [
      'Explicación detallada de beneficios y riesgos de cada cirugía.',
      'Alternativas de tratamiento disponibles para su condición.',
      'Espacio para resolver todas sus dudas con el especialista.',
      'Firma de documentos legales previa a cualquier intervención.'
    ]
  },
  'especialidades-info': {
    title: 'Nuestras Especialidades',
    desc: 'Visum ofrece una cobertura integral en oftalmología, desde controles generales hasta cirugías de alta complejidad.',
    details: [
      'Cataratas y Cirugía con Lentes Premium.',
      'Cirugía Refractiva Láser (LASIK/PRK).',
      'Manejo avanzado de Glaucoma y Retina.',
      'Oculoplastía funcional y Estética Oculofacial.',
      'Exámenes pre-operatorios con tecnología de vanguardia.'
    ]
  },
  'paciente-resumen': {
    title: 'Información al Paciente',
    desc: 'Todo lo que necesita saber para su atención en nuestra clínica, desde el agendamiento hasta sus derechos legales.',
    details: [
      'Procesos de agendamiento y confirmación de citas.',
      'Gestión de presupuestos y medios de pago.',
      'Preparación para cirugías y cuidados post-operatorios.',
      'Marco legal de derechos y deberes del paciente.'
    ]
  }
};

const patologiasData = {
  // Vicios de Refracción
  'miopia': {
    title: 'Miopía',
    desc: 'Dificultad para ver objetos lejanos debido a un ojo más largo de lo normal o una córnea muy curva.',
    details: [
      'Visión borrosa de lejos y nítida de cerca.',
      'Necesidad de entrecerrar los ojos para enfocar.',
      'Fatiga ocular y posibles dolores de cabeza.',
      'Tratamiento con lentes cóncavos o cirugía láser LASIK/PRK.',
      'Se recomienda control anual para monitorear cambios.'
    ]
  },
  'hipermetropia': {
    title: 'Hipermetropía',
    desc: 'Dificultad para enfocar objetos cercanos porque la imagen se forma detrás de la retina.',
    details: [
      'Visión borrosa de cerca, y en grados altos, de lejos.',
      'Dolor de cabeza relacionado con el esfuerzo visual.',
      'Ardor o fatiga ocular tras lectura prolongada.',
      'Corregible con lentes convexos o cirugía refractiva.',
      'Frecuente en niños, tendiendo a disminuir con el crecimiento.'
    ]
  },
  'astigmatismo': {
    title: 'Astigmatismo',
    desc: 'Visión distorsionada a todas las distancias causada por una curvatura irregular de la córnea.',
    details: [
      'Visión con sombras o contornos dobles.',
      'Dificultad para ver detalles finos de cerca y lejos.',
      'Sensibilidad a la luz (fotofobia).',
      'Uso de lentes cilíndricos o tóricos para corrección.',
      'Puede presentarse solo o asociado a miopía/hipermetropía.'
    ]
  },
  'presbicia': {
    title: 'Presbicia',
    desc: 'Pérdida gradual de la capacidad de enfocar de cerca debido al envejecimiento natural del cristalino.',
    details: [
      'Aparición típica después de los 40-45 años.',
      'Necesidad de alejar los textos para poder leerlos.',
      'Visión borrosa en condiciones de poca luz.',
      'Tratamiento con lentes de lectura o multifocales.',
      'Opciones quirúrgicas disponibles según evaluación.'
    ]
  },
  // Segmento Anterior
  'glaucoma': {
    title: 'Glaucoma',
    desc: 'Enfermedad del nervio óptico generalmente asociada a presión intraocular elevada, que puede causar ceguera irreversible.',
    details: [
      'Llamado "ladrón silencioso" por la falta de síntomas iniciales.',
      'Pérdida progresiva de la visión periférica (visión de túnel).',
      'Diagnóstico mediante tonometría y campo visual.',
      'Tratamiento con gotas, láser o cirugía para bajar la presión.',
      'El daño ya causado es irreversible, la detección precoz es clave.'
    ]
  },
  'conjuntivitis': {
    title: 'Conjuntivitis',
    desc: 'Inflamación de la conjuntiva por causas virales, bacterianas o alérgicas.',
    details: [
      'Ojo rojo intenso con lagrimeo y sensación de arenilla.',
      'Secreciones que pueden dejar los párpados pegados al despertar.',
      'Picazón y ardor ocular constante.',
      'Altamente contagiosa si es de origen viral o bacteriano.',
      'Tratamiento específico según el tipo (antibióticos o antihistamínicos).'
    ]
  },
  'ojo-seco': {
    title: 'Ojo Seco',
    desc: 'Falta de lubricación adecuada por mala calidad o insuficiente producción de lágrimas.',
    details: [
      'Ardor, picazón y pesadez en los párpados.',
      'Sensación de cuerpo extraño dentro del ojo.',
      'Visión borrosa que mejora al parpadear.',
      'Agravado por el uso de pantallas y aire acondicionado.',
      'Tratamiento con lágrimas artificiales y geles lubricantes.'
    ]
  },
  'pterigion': {
    title: 'Pterigión',
    desc: 'Crecimiento de tejido carnoso sobre la córnea, asociado a exposición solar y viento.',
    details: [
      'Aparición de una "carnosidad" visible en el lado nasal.',
      'Enrojecimiento recurrente e irritación crónica.',
      'Sensación constante de basura en el ojo.',
      'Puede causar astigmatismo si crece hacia el centro.',
      'El tratamiento definitivo es la cirugía con autoinjerto.'
    ]
  },
  // Segmento Posterior y Retina
  'dmre': {
    title: 'Degeneración Macular (DMRE)',
    desc: 'Deterioro de la mácula que afecta la visión central fina necesaria para leer o conducir.',
    details: [
      'Líneas rectas que se ven onduladas o distorsionadas.',
      'Aparición de una mancha oscura en el centro de la visión.',
      'Dificultad para reconocer rostros o detalles finos.',
      'Principal causa de pérdida visual en mayores de 60 años.',
      'Tratamientos con vitaminas o inyecciones intravítreas.'
    ]
  },
  'retinopatia': {
    title: 'Retinopatía Diabética',
    desc: 'Daño en los vasos sanguíneos de la retina causado por niveles altos de azúcar en sangre.',
    details: [
      'Visión borrosa y aparición de manchas flotantes.',
      'Áreas oscuras o vacías en el campo visual.',
      'Riesgo de hemorragia vítrea o desprendimiento de retina.',
      'Control metabólico estricto es fundamental.',
      'Requiere controles de fondo de ojo anuales obligatorios.'
    ]
  },
  'desprendimiento': {
    title: 'Desprendimiento de Retina',
    desc: 'Emergencia médica donde la retina se separa de su tejido de soporte.',
    details: [
      'Aparición súbita de destellos de luz (fotopsias).',
      'Lluvia de puntos negros flotantes (moscas volantes).',
      'Sensación de una "cortina" negra tapando la visión.',
      'Requiere cirugía urgente para evitar ceguera permanente.',
      'No causa dolor, la pérdida visual es el síntoma principal.'
    ]
  },
  'agujero-macular': {
    title: 'Agujero Macular',
    desc: 'Pequeña rotura en la mácula que causa distorsión severa en la visión central.',
    details: [
      'Pérdida de la visión central nítida.',
      'Las líneas rectas parecen tener un hueco o estar quebradas.',
      'Relacionado generalmente con la edad y tracción del vítreo.',
      'Confirmación mediante examen de OCT.',
      'El tratamiento de elección es la cirugía de Vitrectomía.'
    ]
  },
  // Otras Patologías
  'estrabismo': {
    title: 'Estrabismo',
    desc: 'Falta de alineación de los ojos, que apuntan en direcciones diferentes.',
    details: [
      'Desviación visible de uno o ambos ojos.',
      'Visión doble (diplopía) en adultos.',
      'Dificultad para calcular profundidades y distancias.',
      'Tratamiento con anteojos, parches o cirugía muscular.',
      'Fundamental tratar en la infancia para evitar ambliopía.'
    ]
  },
  'ambliopia': {
    title: 'Ambliopía (Ojo Vago)',
    desc: 'Desarrollo visual deficiente en un ojo durante la niñez temprana.',
    details: [
      'Baja visión persistente a pesar del uso de lentes.',
      'Suele afectar a un solo ojo, pasando desapercibido.',
      'Tratamiento mediante oclusión (parche) del ojo sano.',
      'Solo se puede corregir durante los primeros años de vida.',
      'Detección precoz antes de los 7 años es determinante.'
    ]
  },
  'blefaritis': {
    title: 'Blefaritis',
    desc: 'Inflamación crónica de los párpados debido a bacterias o disfunción glandular.',
    details: [
      'Párpados rojos, hinchados y con picazón.',
      'Presencia de escamas o caspa en la base de las pestañas.',
      'Ojos llorosos y con sensación de ardor.',
      'Frecuente asociación con ojo seco y rosácea.',
      'Requiere higiene palpebral diaria y persistente.'
    ]
  },
  'uveitis': {
    title: 'Uveítis',
    desc: 'Inflamación de la úvea (capa media del ojo) que puede ser grave si no se trata.',
    details: [
      'Ojo rojo con dolor profundo y sensibilidad a la luz.',
      'Visión borrosa y aparición de cuerpos flotantes.',
      'Puede estar asociada a enfermedades autoinmunes.',
      'Riesgo de complicaciones como glaucoma o cataratas.',
      'Tratamiento urgente con corticoides bajo control médico.'
    ]
  }
};

const servicesData = {
  'serv-general': {
    title: 'Oftalmología General',
    desc: 'Evaluación integral de la salud visual para pacientes de todas las edades, fundamental para la detección temprana de patologías.',
    details: [
      'Examen de agudeza visual y refracción.',
      'Tonometría (medición de presión intraocular).',
      'Evaluación detallada de fondo de ojo.',
      'Receta médica para lentes y certificados.',
      'Controles preventivos y detección de glaucoma.'
    ]
  },
  'serv-cataratas': {
    title: 'Cirugía de Cataratas',
    desc: 'Recupere la claridad de su visión con la técnica de Facoemulsificación, el estándar de oro en cirugía oftalmológica moderna.',
    details: [
      'Procedimiento ambulatorio, indoloro y de rápida recuperación.',
      'Implante de Lentes Intraoculares (LIO) de alta tecnología.',
      'Corrección simultánea de presbicia y astigmatismo.',
      'Uso de ultrasonido para fragmentar el cristalino opaco.',
      'Disponible a través de convenio Fonasa PAD.'
    ]
  },
  'serv-refractiva': {
    title: 'Cirugía Refractiva Láser',
    desc: 'Elimine la dependencia de anteojos y lentes de contacto mediante técnicas de alta precisión con tecnología láser excimer.',
    details: [
      'Tratamiento para Miopía, Astigmatismo e Hipermetropía.',
      'Técnicas personalizadas LASIK y PRK.',
      'Procedimiento rápido (aprox. 15 minutos por ojo).',
      'Alta precisión y seguridad con seguimiento ocular.',
      'Evaluación pre-operatoria exhaustiva incluida.'
    ]
  },
  'serv-retina': {
    title: 'Especialidad de Retina y Vítreo',
    desc: 'Tratamiento avanzado para enfermedades que afectan la parte posterior del ojo y que pueden comprometer seriamente la visión.',
    details: [
      'Manejo de Retinopatía Diabética y Desprendimiento de Retina.',
      'Tratamiento de Degeneración Macular Relacionada con la Edad (DMAE).',
      'Inyecciones intravítreas de fármacos antiangiogénicos.',
      'Fotocoagulación con láser de argón.',
      'Cirugía de Vitrectomía para casos de alta complejidad.'
    ]
  },
  'serv-oculoplastica': {
    title: 'Oculoplástica y Estética Periocular',
    desc: 'Cirugía reconstructiva y estética enfocada en los párpados, órbita y vía lagrimal, combinando salud y armonía facial.',
    details: [
      'Blefaroplastia funcional y cosmética (cirugía de párpados).',
      'Corrección de Ptosis (párpados caídos).',
      'Tratamiento de lagrimeo y obstrucción de vía lagrimal.',
      'Procedimientos mínimamente invasivos.',
      'Resultados naturales con enfoque en la salud ocular.'
    ]
  },
  'serv-examen': {
    title: 'Examen Visual Completo',
    desc: 'Batería de pruebas diagnósticas con tecnología de vanguardia para un análisis profundo de la anatomía ocular.',
    details: [
      'Tomografía de Coherencia Óptica (OCT) de mácula y nervio.',
      'Pentacam (Tomografía corneal y segmento anterior).',
      'Biometría óptica con IOL Master para cálculo de lentes.',
      'Campo Visual Computarizado.',
      'Angiografía y Fotografía de fondo de ojo.'
    ]
  }
};

// ─── MODAL CONTROLS ──────────────────────────
const modal = document.getElementById('visum-modal');
const modalInner = document.getElementById('modal-content');

function openModal(type, id = null) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Show loader initially
  modalInner.innerHTML = '<div class="modal-loader"><div class="loader-spinner"></div></div>';

  // Simulate AJAX fetch
  setTimeout(() => {
    fetchModalContent(type, id);
  }, 400);
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// Logic for Modal Content
function fetchModalContent(type, id) {
  let content = '';

  switch (type) {
    case 'doctor': {
      const doc = doctorsData[id];
      if (doc) {
        content = `
          <div class="doctor-profile-modal">
            <div class="doctor-profile-header">
              <div class="doctor-profile-img">
                <img src="https://www.visum.cl/content/uploads/2020/05/visum-doctor.jpg" alt="${doc.name}">
              </div>
              <div class="doctor-profile-info">
                <h2 class="doctor-profile-name">${doc.name}</h2>
                <p class="doctor-profile-title">${doc.title}</p>
                <div class="doctor-profile-tags">
                  <span class="profile-tag">Certificado CONACEM</span>
                  <span class="profile-tag">SOCHIOF</span>
                </div>
              </div>
            </div>
            
            <div class="doctor-profile-body">
              <div class="profile-section">
                <h3>Biografía Profesional</h3>
                <p>${doc.bio}</p>
              </div>
              
              <div class="profile-section">
                <h3>Formación Académica</h3>
                <ul>
                  ${doc.education.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
              
              <div class="profile-section">
                <h3>Experiencia y Membresías</h3>
                <ul>
                  ${doc.experience.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
              
              <div class="modal-actions">
                <a href="#contacto" class="btn btn-primary" onclick="closeModal()">Agendar Cita</a>
              </div>
            </div>
          </div>
        `;
      } else {
        content = '<p>Médico no encontrado.</p>';
      }
      break;
    }

    case 'servicio': {
      const serv = servicesData[id];
      if (serv) {
        content = `
          <h2 class="section-title">${serv.title.split(' ').slice(0, -1).join(' ')} <span class="gradient-text">${serv.title.split(' ').pop()}</span></h2>
          <p class="section-desc">${serv.desc}</p>
          <div class="profile-section" style="margin-top: 24px;">
            <h3>Detalles del procedimiento:</h3>
            <ul class="service-features" style="margin-top: 16px;">
              ${serv.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-actions">
            <a href="https://agendaweb.salutem.cl/app/agenda-web/D4F6/clinica-2020/inicio" class="btn btn-primary" target="_blank" onclick="closeModal()">Agendar Especialista</a>
          </div>
        `;
      } else {
        content = '<p>Información del servicio no encontrada.</p>';
      }
      break;
    }

    case 'patologia': {
      const pat = patologiasData[id];
      if (pat) {
        content = `
          <h2 class="section-title">${pat.title.split(' ').slice(0, -1).join(' ')} <span class="gradient-text">${pat.title.split(' ').pop()}</span></h2>
          <p class="section-desc">${pat.desc}</p>
          <div class="profile-section" style="margin-top: 24px;">
            <h3>Aspectos destacados del tratamiento:</h3>
            <ul class="service-features" style="margin-top: 16px;">
              ${pat.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-actions">
            <a href="#contacto" class="btn btn-primary" onclick="closeModal()">Agendar Evaluación</a>
          </div>
        `;
      } else {
        content = '<p>Información de patología no encontrada.</p>';
      }
      break;
    }

    case 'paciente-info': {
      const info = pacienteInfoData[id];
      if (info) {
        content = `
          <h2 class="section-title">${info.title.split(' ').slice(0, -1).join(' ')} <span class="gradient-text">${info.title.split(' ').pop()}</span></h2>
          <p class="section-desc">${info.desc}</p>
          <div class="profile-section" style="margin-top: 24px;">
            <h3>Información relevante:</h3>
            <ul class="service-features" style="margin-top: 16px;">
              ${info.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
          </div>
          <div class="modal-actions">
            <a href="#contacto" class="btn btn-primary" onclick="closeModal()">Contactar ahora</a>
          </div>
        `;
      } else {
        content = '<p>Información no encontrada.</p>';
      }
      break;
    }
    default:
      content = '<h2>Información</h2><p>Contenido en desarrollo...</p>';
  }

  modalInner.innerHTML = `<div class="reveal visible">${content}</div>`;
}

// ─── ATTACH MODAL TO INTERACTIONS ───────────
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const type = btn.dataset.modalType || 'paciente-info';
    const id = btn.dataset.modal;
    openModal(type, id);
  });
});


document.querySelectorAll('.dropdown-content a').forEach(link => {
  link.addEventListener('click', (e) => {
    const infoId = link.getAttribute('href').replace('#', '');
    if (pacienteInfoData[infoId]) {
      e.preventDefault();
      openModal('paciente-info', infoId);
    }
  });
});

document.getElementById('btn-servicios-hero')?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('paciente-info', 'presupuesto');
});

// ─── FILTER TABS SCROLL INDICATORS ──────────
const filterTabs = document.getElementById('specialty-filters');
const filterWrapper = document.querySelector('.filter-scroll-wrapper');
const leftIndicator = document.querySelector('.filter-indicator--left');
const rightIndicator = document.querySelector('.filter-indicator--right');

if (filterTabs && filterWrapper) {
  const updateIndicators = () => {
    const scrollLeft = filterTabs.scrollLeft;
    const maxScroll = filterTabs.scrollWidth - filterTabs.clientWidth;
    
    filterWrapper.classList.toggle('has-scroll-left', scrollLeft > 10);
    filterWrapper.classList.toggle('has-scroll-right', scrollLeft < maxScroll - 10);
  };

  filterTabs.addEventListener('scroll', updateIndicators);
  window.addEventListener('resize', updateIndicators);
  
  // Initial check
  setTimeout(updateIndicators, 100);

  leftIndicator?.addEventListener('click', () => {
    filterTabs.scrollBy({ left: -200, behavior: 'smooth' });
  });

  rightIndicator?.addEventListener('click', () => {
    filterTabs.scrollBy({ left: 200, behavior: 'smooth' });
  });
}

// ─── INIT ────────────────────────────────────
// initReveal() already called at initial setup

// ─── FOOTER STYLE SWITCH ───────────────────
function initFooterStyleSwitch() {
  const footer = document.querySelector('.footer');
  const styleCheckbox = document.getElementById('footer-style-checkbox');

  if (!footer || !styleCheckbox) return;

  const savedStyle = localStorage.getItem('visum-footer-style');
  if (savedStyle === 'light') {
    footer.classList.add('footer--light');
    styleCheckbox.checked = true;
  }

  styleCheckbox.addEventListener('change', () => {
    if (styleCheckbox.checked) {
      footer.classList.add('footer--light');
      localStorage.setItem('visum-footer-style', 'light');
    } else {
      footer.classList.remove('footer--light');
      localStorage.setItem('visum-footer-style', 'corporate');
    }
  });
}

// Final initialization
initFooterStyleSwitch();
