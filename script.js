/**
 * Portfólio de Mateus Vitalino Araujo
 * Arquivo: script.js
 * Funcionalidades: Alternador de tema com persistência, validação de formulário,
 * navegação móvel e utilitários de interface.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de módulos
  initThemeToggle();
  initMobileMenu();
  initContactForm();
  initCopyEmail();
  initActiveNavOnScroll();
  updateFooterYear();
});

/**
 * 1. GERENCIAMENTO DE TEMA (CLARO / ESCURO)
 * - Persistência no LocalStorage
 * - Respeita preferência do sistema se não houver escolha prévia
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const THEME_STORAGE_KEY = 'mateus_portfolio_theme';
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Se salvou 'light' ou se não há nada salvo mas o sistema prefere light
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
  });
}

/**
 * 2. MENU MOBILE RESPONSIVO
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  // Alternar abertura do menu
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Fechar menu ao clicar em qualquer link de navegação
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Fechar ao clicar fora do menu
  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 3. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
 * - Valida campos obrigatórios (nome, e-mail, assunto, mensagem)
 * - Exibe estados visuais de erro nos grupos
 * - Exibe alerta de sucesso estilizado e limpa os campos
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successAlert = document.getElementById('form-success-alert');
  const submitBtn = document.getElementById('btn-submit');

  if (!form) return;

  const fields = {
    nome: {
      input: document.getElementById('nome'),
      group: document.getElementById('nome')?.closest('.form-group'),
      validate: (val) => val.trim().length >= 3
    },
    email: {
      input: document.getElementById('email'),
      group: document.getElementById('email')?.closest('.form-group'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
    },
    assunto: {
      input: document.getElementById('assunto'),
      group: document.getElementById('assunto')?.closest('.form-group'),
      validate: (val) => val.trim().length >= 3
    },
    mensagem: {
      input: document.getElementById('mensagem'),
      group: document.getElementById('mensagem')?.closest('.form-group'),
      validate: (val) => val.trim().length >= 10
    }
  };

  // Limpa erro conforme o usuário digita
  Object.values(fields).forEach(({ input, group }) => {
    if (!input || !group) return;
    input.addEventListener('input', () => {
      if (group.classList.contains('has-error')) {
        group.classList.remove('has-error');
        input.classList.remove('input-error');
      }
    });
  });

  // Submissão do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Ocultar alerta de sucesso prévio se estiver aberto
    if (successAlert) {
      successAlert.style.display = 'none';
    }

    // Validar cada campo
    Object.entries(fields).forEach(([key, { input, group, validate }]) => {
      if (!input || !group) return;

      const isValid = validate(input.value);
      if (!isValid) {
        group.classList.add('has-error');
        input.classList.add('input-error');
        if (isFormValid) {
          input.focus(); // Coloca o foco no primeiro campo com erro
        }
        isFormValid = false;
      } else {
        group.classList.remove('has-error');
        input.classList.remove('input-error');
      }
    });

    if (!isFormValid) return;

    // Simulação de envio com feedback visual
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Enviando...</span>
      `;
    }

    setTimeout(() => {
      // Exibir feedback de sucesso
      if (successAlert) {
        successAlert.style.display = 'flex';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Limpar campos
      form.reset();

      // Restaurar botão
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Enviar Mensagem</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        `;
      }

      // Ocultar alerta de sucesso após 6 segundos
      setTimeout(() => {
        if (successAlert) {
          successAlert.style.display = 'none';
        }
      }, 6000);
    }, 800);
  });
}

/**
 * 4. COPIAR E-MAIL COM FEEDBACK
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('btn-copy-email');
  const tooltip = document.getElementById('copy-tooltip');
  const emailText = '31131@raphaeldisanto.com.br';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailText);
      } else {
        // Fallback para navegadores legados
        const textArea = document.createElement('textarea');
        textArea.value = emailText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      copyBtn.classList.add('copied');
      if (tooltip) tooltip.textContent = 'Copiado!';

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (tooltip) tooltip.textContent = 'Copiar';
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  });
}

/**
 * 5. LINK ATIVO CONFORME SCROLL
 */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 6. ATUALIZAÇÃO AUTOMÁTICA DO ANO NO RODAPÉ
 */
function updateFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
