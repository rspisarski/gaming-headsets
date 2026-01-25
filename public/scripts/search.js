// Search functionality for Gaming Headsets website
let searchIndex = [];
let currentResults = [];
let selectedIndex = -1;
let searchModal = null;
let isMobile = false;

// Initialize search
document.addEventListener('DOMContentLoaded', function () {
  if (window.searchData) {
    searchIndex = window.searchData.searchData;
    console.log('Search initialized with', searchIndex.length, 'items');
  }

  setupSearchModal();
  setupKeyboardShortcuts();
  setupMobileDetection();

  // Re-initialize on page navigation - FIX FOR ASTRO VIEW TRANSITIONS
  document.addEventListener('astro:page-load', function () {
    if (window.searchData) {
      searchIndex = window.searchData.searchData;
      console.log('Search re-initialized with', searchIndex.length, 'items');
    }
    setupSearchModal();
    setupMobileDetection();
  });
});

function setupMobileDetection() {
  const checkMobile = () => {
    isMobile = window.innerWidth < 1024;
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
}

function setupSearchModal() {
  searchModal = document.getElementById('search-modal');
  if (!searchModal) return;

  const searchInput = document.getElementById('search-input');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const searchClose = document.getElementById('search-close');
  const mobileSearchBack = document.getElementById('mobile-search-back');
  const searchBackdrop = document.getElementById('search-backdrop');
  const searchDesktopWrapper = document.getElementById('search-desktop-wrapper');
  const mobileSearchPanel = document.getElementById('mobile-search-panel');

  // Open search modal
  function openSearchModal() {
    searchModal.classList.remove('hidden');

    if (isMobile) {
      // Mobile: open slide-down panel instantly
      mobileSearchPanel.classList.add('open');
      mobileSearchInput.focus();
    } else {
      // Desktop: open centered modal
      searchInput.value = '';
      searchInput.focus();
      showInitialState();
    }

    document.body.style.overflow = 'hidden';
  }

  // Close search modal
  function closeSearchModal() {
    if (isMobile) {
      mobileSearchPanel.classList.remove('open');
      searchModal.classList.add('hidden');
    } else {
      searchModal.classList.add('hidden');
    }

    document.body.style.overflow = '';
    selectedIndex = -1;

    // Clear search
    if (searchInput) searchInput.value = '';
    if (mobileSearchInput) mobileSearchInput.value = '';
  }

  // Event listeners - make sure elements exist before adding listeners
  const navSearchButton = document.getElementById('nav-search-button');
  if (navSearchButton) {
    navSearchButton.addEventListener('click', openSearchModal);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearchModal);
  }

  if (mobileSearchBack) {
    mobileSearchBack.addEventListener('click', closeSearchModal);
  }

  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', closeSearchModal);
  }

  if (searchDesktopWrapper) {
    searchDesktopWrapper.addEventListener('click', closeSearchModal);
  }

  // Search input handling - desktop
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const query = e.target.value.trim();
      if (query.length > 0) {
        performSearch(query);
      } else {
        showInitialState();
      }
    });
  }

  // Search input handling - mobile
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', function (e) {
      const query = e.target.value.trim();
      if (query.length > 0) {
        performSearch(query);
      } else {
        showMobileInitialState();
      }
    });

    // Mobile keyboard handling
    mobileSearchInput.addEventListener('focus', function () {
      setTimeout(() => {
        mobileSearchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  }

  // Prevent modal close when clicking inside panels
  const searchPanel = document.getElementById('search-panel');
  const mobilePanelContent = mobileSearchPanel?.querySelector('.bg-black\\/95');

  if (searchPanel) {
    searchPanel.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  if (mobilePanelContent) {
    mobilePanelContent.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  // Touch/swipe handling for mobile (now for top-positioned panel)
  if (mobileSearchPanel) {
    let touchStartY = 0;
    let touchEndY = 0;

    mobileSearchPanel.addEventListener('touchstart', function (e) {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mobileSearchPanel.addEventListener('touchend', function (e) {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndY - touchStartY; // Reversed for top positioning
      if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
        if (swipeDistance > 0) {
          // Swiped down - close search
          closeSearchModal();
        } else {
          // Swiped up - do nothing
        }
      }
    }
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function (e) {
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const activeInput = isMobile ? mobileSearchInput : searchInput;

    // Cmd/Ctrl+K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('hidden')) {
        document.getElementById('nav-search-button')?.click();
      } else {
        closeSearchModal();
      }
    }

    // Escape to close
    if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      closeSearchModal();
    }

    // Arrow key navigation when search is active
    if (!searchModal.classList.contains('hidden') && currentResults.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentResults.length;
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = selectedIndex <= 0 ? currentResults.length - 1 : selectedIndex - 1;
        updateSelection();
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selectedItem = document.querySelector(`[data-search-index="${selectedIndex}"]`);
        selectedItem?.click();
      }
    }
  });
}

function performSearch(query) {
  const normalizedQuery = query.toLowerCase();

  currentResults = searchIndex.filter(item => {
    // Search in different fields based on type
    if (item.type === 'headset') {
      return (
        item.name?.toLowerCase().includes(normalizedQuery) ||
        item.brand?.toLowerCase().includes(normalizedQuery) ||
        item.description?.toLowerCase().includes(normalizedQuery) ||
        item.platforms?.some(p => p.toLowerCase().includes(normalizedQuery)) ||
        item.special_features?.some(f => f.toLowerCase().includes(normalizedQuery)) ||
        item.connection_types?.some(c => c.toLowerCase().includes(normalizedQuery))
      );
    } else if (item.type === 'blog') {
      return (
        item.title?.toLowerCase().includes(normalizedQuery) ||
        item.excerpt?.toLowerCase().includes(normalizedQuery) ||
        item.category?.toLowerCase().includes(normalizedQuery) ||
        item.tags?.some(t => t.toLowerCase().includes(normalizedQuery))
      );
    }
    return false;
  });

  // Rank results (exact name/title matches first)
  currentResults.sort((a, b) => {
    const aScore = calculateRelevanceScore(a, normalizedQuery);
    const bScore = calculateRelevanceScore(b, normalizedQuery);
    return bScore - aScore;
  });

  if (isMobile) {
    displayMobileResults(currentResults);
  } else {
    displayResults(currentResults);
  }
}

function calculateRelevanceScore(item, query) {
  let score = 0;

  if (item.type === 'headset') {
    if (item.name?.toLowerCase() === query) score += 100;
    if (item.name?.toLowerCase().startsWith(query)) score += 50;
    if (item.name?.toLowerCase().includes(query)) score += 25;
    if (item.brand?.toLowerCase() === query) score += 40;
    if (item.brand?.toLowerCase().includes(query)) score += 20;
  } else if (item.type === 'blog') {
    if (item.title?.toLowerCase() === query) score += 100;
    if (item.title?.toLowerCase().startsWith(query)) score += 50;
    if (item.title?.toLowerCase().includes(query)) score += 25;
    if (item.category?.toLowerCase() === query) score += 30;
    if (item.category?.toLowerCase().includes(query)) score += 15;
  }

  return score;
}

function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');
  const initialState = document.getElementById('search-initial');
  const noResults = document.getElementById('search-no-results');

  if (!resultsContainer || !initialState || !noResults) return;

  // Hide initial and no results states
  initialState.classList.add('hidden');
  noResults.classList.add('hidden');

  if (results.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  // Group results by type
  const headsetResults = results.filter(r => r.type === 'headset');
  const blogResults = results.filter(r => r.type === 'blog');

  let html = '';

  // Render headset results
  if (headsetResults.length > 0) {
    html += '<div class="search-section border-b border-primary/10">';
    html += '<div class="px-6 py-3 bg-primary/5 border-l-4 border-green-600">';
    html += '<h3 class="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center gap-2"><span class="w-2 h-2 bg-green-600 rounded-full"></span>Headsets</h3>';
    html += '</div>';
    headsetResults.forEach((result, index) => {
      const globalIndex = results.indexOf(result);
      html += createHeadsetResult(result, globalIndex);
    });
    html += '</div>';
  }

  // Render blog results
  if (blogResults.length > 0) {
    html += '<div class="search-section">';
    html += '<div class="px-6 py-3 bg-primary/5 border-l-4 border-blue-600">';
    html += '<h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2"><span class="w-2 h-2 bg-blue-600 rounded-full"></span>Blog Posts</h3>';
    html += '</div>';
    blogResults.forEach((result, index) => {
      const globalIndex = results.indexOf(result);
      html += createBlogResult(result, globalIndex);
    });
    html += '</div>';
  }

  resultsContainer.innerHTML = html;
  resultsContainer.classList.remove('hidden');
}

function displayMobileResults(results) {
  const resultsContainer = document.getElementById('mobile-search-results');
  const initialState = document.getElementById('mobile-search-initial');
  const noResults = document.getElementById('mobile-search-no-results');

  if (!resultsContainer || !initialState || !noResults) return;

  // Hide initial and no results states
  initialState.classList.add('hidden');
  noResults.classList.add('hidden');

  if (results.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  // Group results by type
  const headsetResults = results.filter(r => r.type === 'headset');
  const blogResults = results.filter(r => r.type === 'blog');

  let html = '';

  // Render headset results
  if (headsetResults.length > 0) {
    html += '<div class="search-section">';
    html += '<div class="px-4 py-2 bg-primary/5 border-l-4 border-green-600">';
    html += '<h3 class="text-xs font-bold text-green-600 uppercase tracking-wider">Headsets</h3>';
    html += '</div>';
    headsetResults.forEach((result, index) => {
      const globalIndex = results.indexOf(result);
      html += createMobileHeadsetResult(result, globalIndex);
    });
    html += '</div>';
  }

  // Render blog results
  if (blogResults.length > 0) {
    html += '<div class="search-section">';
    html += '<div class="px-4 py-2 bg-primary/5 border-l-4 border-blue-600">';
    html += '<h3 class="text-xs font-bold text-blue-600 uppercase tracking-wider">Blog Posts</h3>';
    html += '</div>';
    blogResults.forEach((result, index) => {
      const globalIndex = results.indexOf(result);
      html += createMobileBlogResult(result, globalIndex);
    });
    html += '</div>';
  }

  resultsContainer.innerHTML = html;
  resultsContainer.classList.remove('hidden');
}

function createHeadsetResult(result, index) {
  const price = result.price ? `$${result.price}` : 'Price not available';
  const platforms = result.platforms?.slice(0, 3).join(', ') || '';

  return `
    <a 
      href="/headsets/${result.slug}" 
      class="search-result flex items-center gap-4 px-6 py-3 hover:bg-primary/10 transition-all cursor-pointer border-l-4 border-transparent hover:border-primary"
      data-search-index="${index}"
    >
      <img src="${result.image}" alt="${result.name}" class="w-12 h-12 object-cover rounded border border-primary/20" />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 text-xs font-semibold bg-green-600 text-white rounded-full">Headset</span>
          <span class="text-sm text-text/60">${result.brand}</span>
        </div>
        <h4 class="font-semibold text-text truncate">${result.name}</h4>
        <p class="text-sm text-text/60 truncate">${platforms}</p>
      </div>
      <div class="text-right">
        <p class="text-primary font-bold text-lg">${price}</p>
      </div>
    </a>
  `;
}

function createMobileHeadsetResult(result, index) {
  const price = result.price ? `$${result.price}` : '';
  const platforms = result.platforms?.slice(0, 2).join(', ') || '';

  return `
    <a 
      href="/headsets/${result.slug}" 
      class="search-result flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-all cursor-pointer border-l-4 border-transparent hover:border-primary"
      data-search-index="${index}"
    >
      <img src="${result.image}" alt="${result.name}" class="w-10 h-10 object-cover rounded border border-primary/20 flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-1.5 py-0.5 text-xs font-semibold bg-green-600 text-white rounded">Headset</span>
          <span class="text-xs text-text/60">${result.brand}</span>
          ${price ? `<span class="text-xs text-primary font-semibold ml-auto">${price}</span>` : ''}
        </div>
        <h4 class="font-semibold text-text truncate text-sm">${result.name}</h4>
        ${platforms ? `<p class="text-xs text-text/60 truncate">${platforms}</p>` : ''}
      </div>
    </a>
  `;
}

function createBlogResult(result, index) {
  const date = result.published ? new Date(result.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return `
    <a 
      href="/blog/${result.slug}" 
      class="search-result flex items-center gap-4 px-6 py-3 hover:bg-primary/10 transition-all cursor-pointer border-l-4 border-transparent hover:border-primary"
      data-search-index="${index}"
    >
      <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">Blog</span>
          <span class="text-sm text-text/60">${result.category}</span>
          ${date ? `<span class="text-xs text-text/40">${date}</span>` : ''}
        </div>
        <h4 class="font-semibold text-text truncate text-base">${result.title}</h4>
        <p class="text-sm text-text/60 line-clamp-2">${result.excerpt}</p>
      </div>
    </a>
  `;
}

function createMobileBlogResult(result, index) {
  const date = result.published ? new Date(result.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return `
    <a 
      href="/blog/${result.slug}" 
      class="search-result flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-all cursor-pointer border-l-4 border-transparent hover:border-primary"
      data-search-index="${index}"
    >
      <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-1.5 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded">Blog</span>
          <span class="text-xs text-text/60">${result.category}</span>
          ${date ? `<span class="text-xs text-text/40">${date}</span>` : ''}
        </div>
        <h4 class="font-semibold text-text truncate text-sm">${result.title}</h4>
        <p class="text-xs text-text/60 line-clamp-2">${result.excerpt}</p>
      </div>
    </a>
  `;
}

function showInitialState() {
  const resultsContainer = document.getElementById('search-results');
  const initialState = document.getElementById('search-initial');
  const noResults = document.getElementById('search-no-results');

  if (resultsContainer) resultsContainer.classList.add('hidden');
  if (noResults) noResults.classList.add('hidden');
  if (initialState) initialState.classList.remove('hidden');

  currentResults = [];
  selectedIndex = -1;
}

function showMobileInitialState() {
  const resultsContainer = document.getElementById('mobile-search-results');
  const initialState = document.getElementById('mobile-search-initial');
  const noResults = document.getElementById('mobile-search-no-results');

  if (resultsContainer) resultsContainer.classList.add('hidden');
  if (noResults) noResults.classList.add('hidden');
  if (initialState) initialState.classList.remove('hidden');

  currentResults = [];
  selectedIndex = -1;
}

function updateSelection() {
  const allResults = document.querySelectorAll('.search-result');
  allResults.forEach((result, index) => {
    if (index === selectedIndex) {
      result.classList.add('bg-primary/20');
    } else {
      result.classList.remove('bg-primary/20');
    }
  });
}

// Helper function to close search (used by event listeners)
window.closeSearchModal = closeSearchModal;