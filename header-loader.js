const HEADER_LOADER_VERSION = '1.0';

const defaultHeaderOptions = {
  placeholderId: 'header-placeholder',
  headerPath: 'header.html',
  activeClass: 'active'
};

function loadHeader(customOptions = {}) {
  const options = { ...defaultHeaderOptions, ...customOptions };
  const placeholder = document.getElementById(options.placeholderId);

  if (!placeholder) {
    return Promise.resolve();
  }

  const versionedPath = options.headerPath.includes('?')
    ? `${options.headerPath}&v=${HEADER_LOADER_VERSION}`
    : `${options.headerPath}?v=${HEADER_LOADER_VERSION}`;

  return fetch(versionedPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load header HTML: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then((html) => {
      placeholder.innerHTML = html;
      highlightActiveLink(placeholder, options.activeClass);
    })
    .catch((error) => {
      console.error('Failed to inject header:', error);
    });
}

function highlightActiveLink(container, activeClass) {
  // Adds the active class to the navigation link that matches the current page.
  const currentPage = window.location.href;
  const navLinks = container.querySelectorAll('a[href]');

  navLinks.forEach((link) => {
    if (link.href === currentPage) {
      link.classList.add(activeClass);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
  });
} else {
  loadHeader();
}
