import { isLocale } from '../config/locales';
import { navigate } from 'astro:transitions/client';

export function initLanguagePicker() {
  const select = document.getElementById('language-select') as HTMLSelectElement | null;
  const langLinks = document.querySelectorAll<HTMLAnchorElement>('.mobile-lang-links a');

  const handleLanguageChange = (newLang: string | null) => {
    if (!newLang) return;

    const currentPath = window.location.pathname;

    if (currentPath.startsWith(`/${newLang}/`) || (currentPath === `/${newLang}`)) {
      return;
    }

    let newPath: string;
    const pathParts = currentPath.split('/').filter(Boolean);

    if (currentPath === '/' || pathParts.length === 0) {
      newPath = `/${newLang}/`;
    } else if (isLocale(pathParts[0])) {
      newPath = `/${newLang}/${pathParts.slice(1).join('/')}`;
    } else {
      newPath = `/${newLang}/${pathParts.join('/')}`;
    }

    if (!newPath.endsWith('/') && !newPath.includes('.')) {
      newPath += '/';
    }
    
    navigate(newPath);
  };

  if (select) {
    select.addEventListener('change', (event) => {
      handleLanguageChange((event.target as HTMLSelectElement).value);
    });
  }

  langLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      handleLanguageChange(link.dataset.lang || null);
    });
  });
} 