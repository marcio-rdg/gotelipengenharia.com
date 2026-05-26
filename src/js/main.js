import '../scss/style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const navLinks = document.querySelectorAll('.navbar__link');

  const menuNav = document.querySelector('.menu-nav');
  const menuCase = document.querySelector('.navbar__case');
  const menuCta = document.querySelector('.navbar__cta');

  function closeMobileMenu() {
    if (menuCase && menuCta && menuNav) {
      menuCase.classList.remove('active');
      menuCta.classList.remove('active');
      menuNav.classList.remove('active');
      menuNav.innerHTML = '☰';
    }
  }

  if (menuNav) {
    menuNav.addEventListener('click', () => {
      menuCase.classList.toggle('active');
      menuCta.classList.toggle('active');
      menuNav.classList.toggle('active');

      menuNav.innerHTML = menuNav.classList.contains('active') ? 'X' : '☰';
    });
  }

  contentDiv.addEventListener('click', (e) => {
    const clickedQuestion = e.target.closest('.faq__question');
    if (!clickedQuestion) return;

    const allQuestions = contentDiv.querySelectorAll('.faq__question');
    allQuestions.forEach((question) => {
      if (question === clickedQuestion) {
        question.classList.toggle('active');
      } else {
        question.classList.remove('active');
      }
    });
  });

  async function loadPage(pageName) {
    try {
      const response = await fetch(`/pages/${pageName}.html`);
      if (!response.ok) throw new Error('Página não encontrada');

      const html = await response.text();
      contentDiv.innerHTML = html;

      updateActiveLink(pageName);

      if (pageName === 'services') {
        const urlParams = new URLSearchParams(window.location.search);
        const servicoAlvo = urlParams.get('servico');

        if (servicoAlvo) {
          const elementoTarget = document.getElementById(servicoAlvo);

          if (elementoTarget) {
            setTimeout(() => {
              elementoTarget.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }, 80);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar a página:', error);
      contentDiv.innerHTML =
        '<h2 style="padding: 50px; text-align: center;">Erro 404.</h2>';
    }
  }

  function updateActiveLink(pageName) {
    navLinks.forEach((link) => {
      if (link.getAttribute('data-page') === pageName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.navbar__link');
    if (!link) return;

    e.preventDefault();
    closeMobileMenu();

    const page = link.getAttribute('data-page');
    if (!page) return;

    const href = link.getAttribute('href');

    history.pushState({ page }, '', href);

    loadPage(page);
  });

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      loadPage(e.state.page);
    } else {
      loadPage('home');
    }
  });

  function initRouter() {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const initialPage = path === '' ? 'home' : path;

    history.replaceState(
      { page: initialPage },
      '',
      window.location.pathname + window.location.search
    );

    loadPage(initialPage);
  }

  initRouter();
});
