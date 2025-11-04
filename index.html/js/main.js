// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initTheme();
    initNavigation();
    initFormValidation();
    initSmoothScrolling();
    initLazyLoading();
    
    console.log('🌸 Flores del Alma - Página cargada correctamente');
});

// ===== MANEJO DE TEMAS =====
function initTheme() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌓';
    themeToggle.setAttribute('aria-label', 'Cambiar entre modo claro y oscuro');
    themeToggle.classList.add('theme-toggle');
    
    // Posicionar el botón
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.background = 'var(--color-primary)';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.fontSize = '1.2rem';
    themeToggle.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    document.body.appendChild(themeToggle);
    
    // Manejar el cambio de tema
    themeToggle.addEventListener('click', toggleTheme);
    
    // Aplicar tema guardado o detectar preferencia del sistema
    applySavedTheme();
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let theme = savedTheme;
    
    if (!theme) {
        theme = systemPrefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀';
        themeToggle.setAttribute('aria-label', 
            theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
}

// ===== NAVEGACIÓN =====
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            
            // Animación del icono hamburguesa
            const spans = this.querySelectorAll('span');
            if (!isExpanded) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                // Reset animación hamburguesa
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Manejar navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navList = document.querySelector('.nav-list');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    // Ya está habilitado en CSS, pero añadimos funcionalidad extra
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Focus para accesibilidad
                    if (target.hasAttribute('tabindex')) {
                        target.focus();
                    }
                }
            }
        });
    });
}

// ===== FORMULARIO =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showSuccessMessage(this);
                this.reset();
            }
        });
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Required validation
    if (!value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    // Email validation
    else if (field.type === 'email' && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Por favor, introduce un email válido';
    }
    // Phone validation
    else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Por favor, introduce un teléfono válido';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e53e3e';
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.style.display = 'block';
    errorElement.style.color = '#e53e3e';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.removeAttribute('aria-invalid');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.style.background = '#48bb78';
    successMessage.style.color = 'white';
    successMessage.style.padding = '1rem';
    successMessage.style.borderRadius = '8px';
    successMessage.style.marginBottom = '1rem';
    successMessage.style.textAlign = 'center';
    successMessage.textContent = '¡Mensaje enviado correctamente! Te contactaremos pronto.';
    
    form.insertBefore(successMessage, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// ===== UTILIDADES =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function scrollToCatalog() {
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = catalogSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function initLazyLoading() {
    // Intersection Observer para lazy loading nativo
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===== PERFORMANCE Y OFFLINE =====
// Prefetch para recursos importantes
function prefetchResources() {
    const links = [
        '/images/ramo-cumpleanos.jpg',
        '/images/ramo-aniversario.jpg',
        '/images/ramo-especial.jpg'
    ];
    
    links.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Iniciar prefetch cuando la página esté cargada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prefetchResources);
} else {
    prefetchResources();
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
});

// ===== PWA (Progressive Web App) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado correctamente: ', registration.scope);
            })
            .catch(function(error) {
                console.log('Error registrando ServiceWorker: ', error);
            });
    });
}