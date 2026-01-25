// Search functionality for Gaming Headsets website
let searchIndex = [];
let currentResults = [];
let selectedIndex = -1;

// Initialize search
document.addEventListener('DOMContentLoaded', function() {
  if (window.searchData) {
    searchIndex = window.searchData.searchData;
    console.log('Search initialized with', searchIndex.length, 'items');
  }
  
  setupSearchModal();
  setupKeyboardShortcuts();
});

function setupSearchModal() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchBackdrop = document.getElementById('search-backdrop');
  
  // Open search modal
  function openSearchModal() {
    searchModal.classList.remove('hidden');
    searchInput.value = '';
    showInitialState();
    document.body.style.overflow = 'hidden';
    // Focus input after a small delay for animation
    setTimeout(() => searchInput.focus(), 100);
  }
  
  // Close search modal
  function closeSearchModal() {
    searchModal.classList.add('hidden');
    document.body.style.overflow = '';
    selectedIndex = -1;
  }
  
  // Event listeners
  document.getElementById('nav-search-button')?.addEventListener('click', openSearchModal);
  searchClose.addEventListener('click', closeSearchModal);
  searchBackdrop.addEventListener('click', closeSearchModal);
  
  // Search input handling
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    if (query.length > 0) {
      performSearch(query);
    } else {
      showInitialState();
    }
  });
  
  // Prevent modal close when clicking inside
  document.getElementById('search-panel').addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    
    // Cmd/Ctrl+K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.contains('hidden') ? 
        document.getElementById('nav-search-button').click() : 
        document.getElementById('search-close').click();
    }
    
    // Escape to close
    if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      document.getElementById('search-close').click();
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
  
  displayResults(currentResults);
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

function showInitialState() {
  document.getElementById('search-results').classList.add('hidden');
  document.getElementById('search-no-results').classList.add('hidden');
  document.getElementById('search-initial').classList.remove('hidden');
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

// Re-initialize on page navigation
document.addEventListener('astro:page-load', function() {
  if (window.searchData) {
    searchIndex = window.searchData.searchData;
    console.log('Search re-initialized with', searchIndex.length, 'items');
  }
});