// Client-side filtering and favorites functionality
let headsets = [];
let favorites = JSON.parse(localStorage.getItem('headsetFavorites')) || [];
let selectedFeature = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, checking for headsetData');
  if (window.headsetData) {
    console.log('Headset data found, initializing');
    headsets = window.headsetData.headsetData;
    initializeFavorites();

    initializeFeatureSelector();
  } else {
    console.log('No headset data');
  }
});

// Basic filters removed - now using only feature-based filtering

// Basic filter functions removed - now using only feature-based filtering

// Note: Sorting functionality removed as per user request

function getCurrentDisplayedHeadsets() {
  const cards = document.querySelectorAll('#headsets-grid > div');
  const displayedIds = Array.from(cards).map(card =>
    card.querySelector('.favorite-button')?.dataset.headsetId
  ).filter(Boolean);

  return headsets.filter(headset => displayedIds.includes(headset.id));
}

function displayHeadsets(headsetsToShow) {
  const grid = document.getElementById('headsets-grid');
  const resultsCount = document.getElementById('results-count');

  if (!grid) return;

  grid.innerHTML = '';

  headsetsToShow.forEach(headset => {
    const card = createHeadsetCard(headset);
    grid.appendChild(card);
  });

  if (resultsCount) {
    resultsCount.textContent = headsetsToShow.length;
  }

  // Re-initialize favorite buttons for new cards
  initializeFavoriteButtons();
}

function createHeadsetCard(headset, matchResult = null) {
  const card = document.createElement('div');
  card.className = 'group bg-dark-card rounded-xl border border-dark-border shadow-sm hover:shadow-xl hover:border-mauve-500/30 transition-all duration-300 overflow-hidden flex flex-col h-full relative';

  const isFavorite = favorites.includes(headset.id);
  const matchStyling = matchResult ? getMatchStyling(matchResult.matchType) : null;

  // content for the feature section
  let featuresHtml = '';

  if (matchResult) {
    // Helper to create pills for matches
    const createMatchPill = (match, type) => {
      let text = match.value;
      if (match.feature === 'price_tier') text = match.value;
      else text = text.replace(/_/g, ' ');
      text = text.charAt(0).toUpperCase() + text.slice(1);

      if (type === 'must') {
        return `<span class="px-2.5 py-1 bg-soft-periwinkle-900/50 text-soft-periwinkle-200 text-xs font-medium rounded-md border border-soft-periwinkle-500/50 flex items-center gap-1">
          <span class="text-[10px]">❤️</span> ${text}
        </span>`;
      } else {
        return `<span class="px-2.5 py-1 bg-frozen-lake-900/50 text-frozen-lake-200 text-xs font-medium rounded-md border border-frozen-lake-500/50 flex items-center gap-1">
          <span class="text-[10px]">👍</span> ${text}
        </span>`;
      }
    };

    const mustHavePills = matchResult.matchedMustHave.map(m => createMatchPill(m, 'must')).join('');
    const niceToHavePills = matchResult.matchedNiceToHave.map(m => createMatchPill(m, 'nice')).join('');

    if (mustHavePills || niceToHavePills) {
      featuresHtml = `
        <div class="flex flex-wrap gap-2 mb-4">
          ${mustHavePills}
          ${niceToHavePills}
        </div>`;
    } else {
      featuresHtml = `<p class="text-sm text-dark-text-muted italic mb-4">Matches based on implicit criteria.</p>`;
    }
  }
  // Else: Default view has no features as per request

  card.innerHTML = `
    <div class="relative w-full aspect-[4/3] bg-dark-surface overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
      <img 
        src="${headset.image}" 
        alt="${headset.brand} ${headset.name} gaming headset"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <!-- Price Badge floating on image -->
      <div class="absolute top-3 right-3 bg-dark-bg/90 backdrop-blur-sm border border-dark-border px-3 py-1 rounded-full shadow-lg">
        <span class="text-emerald-400 font-bold">$${headset.price}</span>
      </div>
      
      <!-- Match Status Overlay/Banner (Only if matchResult exists) -->
      ${matchStyling ? `
      <div class="absolute bottom-0 left-0 w-full ${matchStyling.bg} backdrop-blur-md border-t ${matchStyling.border} px-4 py-2 flex justify-between items-center bg-opacity-95">
        <span class="${matchStyling.text} text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          ${matchStyling.label}
        </span>
        ${matchResult.score > 0 ? `<span class="${matchStyling.text} text-sm font-extrabold">${matchResult.score}%</span>` : ''}
      </div>
      ` : ''}
    </div>
    
    <div class="p-5 flex flex-col flex-1">
      <!-- Header -->
      <div class="mb-4">
        <div class="flex justify-between items-start mb-1">
          <span class="text-xs font-bold tracking-wider text-mauve-400 uppercase">${headset.brand}</span>
        </div>
        <h3 class="text-xl font-bold text-dark-text-primary leading-tight group-hover:text-mauve-300 transition-colors">${headset.name}</h3>
      </div>

      <!-- Features Section (Dynamic content) -->
      <div class="flex-1">
        ${featuresHtml}
      </div>
      
      <!-- Actions -->
      <div class="mt-auto pt-4 border-t border-dark-border/50 flex items-center justify-between gap-3">
        <a 
          href="/headsets/${headset.id}"
          class="flex-1 text-center px-4 py-2 bg-mauve-600 hover:bg-mauve-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-mauve-900/20"
        >
          View Details
        </a>
        <button 
          class="favorite-button p-2 text-dark-text-muted hover:text-red-400 hover:bg-dark-surface rounded-lg transition-all border border-transparent hover:border-dark-border"
          data-headset-id="${headset.id}"
          aria-label="Add to favorites"
        >
          <svg class="w-6 h-6 ${isFavorite ? 'text-red-500' : ''} favorite-icon ${isFavorite ? 'hidden' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <svg class="w-6 h-6 ${isFavorite ? 'text-red-500' : ''} favorite-icon-filled ${isFavorite ? '' : 'hidden'}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  return card;
}

function initializeFavorites() {
  // Export favorites
  document.getElementById('export-favorites')?.addEventListener('click', exportFavorites);

  // Import favorites
  document.getElementById('import-favorites')?.addEventListener('click', () => {
    document.getElementById('import-file')?.click();
  });

  document.getElementById('import-file')?.addEventListener('change', importFavorites);

  initializeFavoriteButtons();
}

function initializeFeatureSelector() {
  console.log('Initializing feature selector');
  const findMatchesBtn = document.getElementById('find-matches');
  const clearFeaturesBtn = document.getElementById('clear-features');
  const selectedCountEl = document.getElementById('selected-count');

  findMatchesBtn?.addEventListener('click', findMatches);
  clearFeaturesBtn?.addEventListener('click', clearFeatures);

  // Initialize drag and drop
  initializeDragAndDrop();

  // Update selected count
  updateSelectedCount();
}

function updateSelectedCount() {
  const mustHaveCount = document.querySelectorAll('#must-have-features .feature-pill').length;
  const niceToHaveCount = document.querySelectorAll('#nice-to-have-features .feature-pill').length;
  const totalCount = mustHaveCount + niceToHaveCount;

  const selectedCountEl = document.getElementById('selected-count');
  const mustHaveCountEl = document.getElementById('must-have-count');
  const niceToHaveCountEl = document.getElementById('nice-to-have-count');

  if (selectedCountEl) {
    selectedCountEl.textContent = totalCount;
  }
  if (mustHaveCountEl) {
    mustHaveCountEl.textContent = mustHaveCount;
  }
  if (niceToHaveCountEl) {
    niceToHaveCountEl.textContent = niceToHaveCount;
  }
}

function findMatches() {
  console.log('🔍 Find Matches clicked');
  const selectedFeatures = collectSelectedFeatures();
  console.log('📋 Selected features:', selectedFeatures);

  if (selectedFeatures.length === 0) {
    console.log('⚠️ No features selected - showing all headsets with message');
    displayNoMatchesFound();
    return;
  }

  console.log(`🎯 Calculating matches for ${headsets.length} headsets...`);
  const matches = headsets.map(headset => calculateMatch(headset, selectedFeatures))
    .filter(match => match.matchType !== 'none');

  console.log(`📊 Found ${matches.length} matching headsets`);
  const sortedMatches = sortMatches(matches);

  displayMatches(sortedMatches);
}

function collectSelectedFeatures() {
  const features = [];

  // Collect must-have features
  document.querySelectorAll('#must-have-features .feature-pill').forEach(pill => {
    features.push({
      category: pill.dataset.feature,
      feature: pill.dataset.feature,
      value: pill.dataset.value,
      priority: 'must-have'
    });
  });

  // Collect nice-to-have features
  document.querySelectorAll('#nice-to-have-features .feature-pill').forEach(pill => {
    features.push({
      category: pill.dataset.feature,
      feature: pill.dataset.feature,
      value: pill.dataset.value,
      priority: 'nice-to-have'
    });
  });

  return features;
}

function calculateMatch(headset, selectedFeatures) {
  const mustHaveFeatures = selectedFeatures.filter(f => f.priority === 'must-have');
  const niceToHaveFeatures = selectedFeatures.filter(f => f.priority === 'nice-to-have');

  console.log(`🔍 Checking ${headset.name}: ${mustHaveFeatures.length} must-have, ${niceToHaveFeatures.length} nice-to-have features`);

  if (mustHaveFeatures.length === 0) {
    return {
      headsetId: headset.id,
      score: 0,
      matchType: 'none',
      mustHaveMatchCount: 0,
      niceToHaveMatchCount: 0,
      totalMustHave: 0,
      totalNiceToHave: niceToHaveFeatures.length,
      matchedMustHave: [],
      matchedNiceToHave: [],
      missingMustHave: []
    };
  }

  const mustHaveMatches = mustHaveFeatures.filter(f => featureMatches(f, headset));
  const niceToHaveMatches = niceToHaveFeatures.filter(f => featureMatches(f, headset));

  const mustHaveMatchCount = mustHaveMatches.length;
  const niceToHaveMatchCount = niceToHaveMatches.length;
  const missingMustHave = mustHaveFeatures.filter(f => !mustHaveMatches.includes(f));

  if (missingMustHave.length > 0) {
    return {
      headsetId: headset.id,
      score: 0,
      matchType: 'none',
      mustHaveMatchCount: 0,
      niceToHaveMatchCount: 0,
      totalMustHave: mustHaveFeatures.length,
      totalNiceToHave: niceToHaveFeatures.length,
      matchedMustHave: [],
      matchedNiceToHave: [],
      missingMustHave: missingMustHave.map(f => f.feature)
    };
  }

  const score = (mustHaveMatchCount * 100) + (niceToHaveMatchCount * 2);

  // Calculate match type based on nice-to-have completion percentage
  let matchType;
  if (niceToHaveFeatures.length === 0) {
    // No nice-to-have features selected - if must-haves are satisfied, it's complete
    matchType = 'complete';
  } else {
    const niceToHavePercentage = niceToHaveMatchCount / niceToHaveFeatures.length;
    if (niceToHavePercentage >= 1.0) matchType = 'complete';
    else if (niceToHavePercentage >= 0.5) matchType = 'majority';
    else matchType = 'partial';
  }

  console.log(`✅ ${headset.name}: ${mustHaveMatchCount}/${mustHaveFeatures.length} must-have, ${niceToHaveMatchCount}/${niceToHaveFeatures.length} nice-to-have → ${matchType} (score: ${score})`);

  return {
    headsetId: headset.id,
    score,
    matchType,
    mustHaveMatchCount,
    niceToHaveMatchCount,
    totalMustHave: mustHaveFeatures.length,
    totalNiceToHave: niceToHaveFeatures.length,
    matchedMustHave: mustHaveMatches,
    matchedNiceToHave: niceToHaveMatches,
    missingMustHave: []
  };
}

function featureMatches(selected, headset) {
  const { feature, value } = selected;

  switch (feature) {
    case 'compatibility':
      return headset.compatibility.includes(value);
    case 'cord_type':
      return cordTypeMatches(value, headset);
    case 'microphone_type':
      return value === headset.microphone_type;
    case 'noise_cancellation':
      return noiseCancellationMatches(value, headset);
    case 'rgb_lighting':
      return rgbLightingMatches(value, headset);
    case 'software_support':
      return softwareSupportMatches(value, headset);
    case 'software_app':
      return value === headset.software_app;
    case 'replaceable_earpads':
      return value === 'true' ? headset.replaceable_earpads : true;
    case 'brand':
      return value === headset.brand;
    case 'price_tier':
      return priceTierMatches(value, headset.price);
    default:
      return false;
  }
}

function cordTypeMatches(selected, headset) {
  switch (selected) {
    case 'wireless': return headset.wireless;
    case 'wired': return headset.wired;
    case 'dual': return headset.wireless && headset.wired;
    default: return false;
  }
}

function noiseCancellationMatches(selected, headset) {
  switch (selected) {
    case 'false': return headset.noise_cancellation === 'false';
    case 'true': return headset.noise_cancellation !== 'false';
    case 'active': return headset.noise_cancellation === 'active';
    case 'pass through': return headset.noise_cancellation === 'pass through';
    case 'open back': return headset.noise_cancellation === 'open back';
    default: return false;
  }
}

function rgbLightingMatches(selected, headset) {
  switch (selected) {
    case 'false': return headset.rgb_lighting === 'false';
    case 'true': return headset.rgb_lighting === 'true';
    default: return false;
  }
}

function softwareSupportMatches(selected, headset) {
  switch (selected) {
    case 'none':
      return !headset.software_support || headset.software_support === 'none';
    case 'basic':
      return headset.software_support === 'basic';
    case 'advanced':
      return headset.software_support === 'advanced';
    default:
      return false;
  }
}

function priceTierMatches(tier, price) {
  switch (tier) {
    case 'affordable':
      return price <= 75;
    case 'budget':
      return price >= 76 && price <= 150;
    case 'premium':
      return price >= 151 && price <= 250;
    case 'ultra-premium':
      return price >= 251;
    default:
      return false;
  }
}

function sortMatches(matches) {
  return matches.sort((a, b) => {
    const matchTypeOrder = { 'complete': 3, 'majority': 2, 'partial': 1, 'none': 0 };
    const typeDiff = matchTypeOrder[b.matchType] - matchTypeOrder[a.matchType];
    if (typeDiff !== 0) return typeDiff;
    return b.score - a.score;
  });
}

function displayMatches(matches) {
  const grid = document.getElementById('headsets-grid');
  const resultsCount = document.getElementById('results-count');

  if (!grid) return;

  grid.innerHTML = '';

  matches.forEach(match => {
    const headset = headsets.find(h => h.id === match.headsetId);
    if (headset) {
      const card = createHeadsetCard(headset, match);
      grid.appendChild(card);
    }
  });

  if (resultsCount) {
    resultsCount.textContent = matches.length;
  }

  initializeFavoriteButtons();
}



function displayNoMatchesFound() {
  const grid = document.getElementById('headsets-grid');
  const resultsCount = document.getElementById('results-count');

  if (!grid) return;

  grid.innerHTML = '';

  // Add message card
  const messageCard = document.createElement('div');
  messageCard.className = 'bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center';
  messageCard.innerHTML = `
    <div class="text-blue-600 mb-4">
      <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-blue-900 mb-2">No Features Selected</h3>
    <p class="text-blue-700 mb-4">Try clicking features to cycle through must-have, nice-to-have, and unselected states!</p>
    <p class="text-sm text-blue-600 mb-4">Here are all available headsets to browse:</p>
  `;
  grid.appendChild(messageCard);

  // Show all headsets below the message
  headsets.forEach(headset => {
    const card = createHeadsetCard(headset);
    grid.appendChild(card);
  });

  if (resultsCount) resultsCount.textContent = headsets.length;
  initializeFavoriteButtons();
}

function getMatchStyling(matchType) {
  switch (matchType) {
    case 'complete':
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Complete Match' };
    case 'majority':
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', label: 'Majority Match' };
    case 'partial':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Partial Match' };
    default:
      return null;
  }
}

function initializeDragAndDrop() {
  // Add click event listeners to available features for cycling states
  document.querySelectorAll('.feature-item').forEach(item => {
    console.log('Adding click listener to feature:', item.dataset.feature, item.dataset.value);
    item.addEventListener('click', function (e) {
      cycleFeatureState(this);
    });
  });
}

function cycleFeatureState(pill) {
  console.log('Cycling feature:', pill.dataset.feature, pill.dataset.value, 'current state:', pill.dataset.state);
  const currentState = pill.dataset.state;
  let newState;
  if (currentState === 'none') {
    newState = 'must-have';
  } else if (currentState === 'must-have') {
    newState = 'nice-to-have';
  } else {
    newState = 'none';
  }

  console.log('New state:', newState);
  // Update state
  pill.dataset.state = newState;

  // Update visual classes
  pill.classList.remove('state-none', 'state-must', 'state-nice');
  if (newState === 'must-have') {
    pill.classList.add('state-must');
    console.log('Set must-have style');
  } else if (newState === 'nice-to-have') {
    pill.classList.add('state-nice');
    console.log('Set nice-to-have style');
  } else {
    pill.classList.add('state-none');
    console.log('Set none style');
  }

  // Update zones
  removeFromZones(pill);
  if (newState !== 'none') {
    addToZone(pill, newState);
  }

  // Update counts
  updateSelectedCount();
  console.log('Cycle complete');
}

function removeFromZones(pill) {
  const feature = pill.dataset.feature;
  const value = pill.dataset.value;
  ['must-have-features', 'nice-to-have-features'].forEach(zoneId => {
    const zone = document.getElementById(zoneId);
    if (zone) {
      const existing = zone.querySelector(`[data-feature="${feature}"][data-value="${value}"]`);
      if (existing) {
        existing.remove();
      }
    }
  });
}

function addToZone(pill, state) {
  const zoneId = state === 'must-have' ? 'must-have-features' : 'nice-to-have-features';
  const zone = document.getElementById(zoneId);
  if (!zone) return;

  // Create a new pill for the zone
  const zonePill = document.createElement('div');
  zonePill.className = `feature-pill feature-item inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border cursor-pointer group ${state === 'must-have'
    ? 'state-must'
    : 'state-nice'
    }`;
  zonePill.dataset.feature = pill.dataset.feature;
  zonePill.dataset.value = pill.dataset.value;
  zonePill.dataset.priority = state;

  // Format the display text
  let displayText = pill.dataset.value;
  const feature = pill.dataset.feature;
  switch (feature) {
    case 'cord_type':
    case 'microphone_type':
    case 'noise_cancellation':
      displayText = displayText.replace('_', ' ');
      break;
    case 'replaceable_earpads':
      displayText = 'Replaceable Earpads';
      break;
    case 'software_support':
      displayText = displayText + ' software';
      break;
    case 'price_tier':
      const tierLabels = {
        'affordable': 'Affordable ($0-75)',
        'budget': 'Budget ($76-150)',
        'premium': 'Premium ($151-250)',
        'ultra-premium': 'Ultra Premium ($251+)'
      };
      displayText = tierLabels[displayText] || displayText;
      break;
  }

  zonePill.innerHTML = `
     <span>${displayText}</span>
     <button class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700">
       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
       </svg>
     </button>
   `;

  // Add remove functionality
  zonePill.querySelector('button').addEventListener('click', function (e) {
    e.stopPropagation();
    zonePill.remove();
    // Reset the original pill to none
    pill.dataset.state = 'none';
    pill.classList.remove('state-must', 'state-nice');
    pill.classList.add('state-none');
    updateSelectedCount();
  });

  zone.appendChild(zonePill);
}

function clearFeatures() {
  // Clear all feature pills
  document.querySelectorAll('.feature-pill').forEach(pill => pill.remove());

  // Reset all feature items to none
  document.querySelectorAll('.feature-item').forEach(item => {
    item.dataset.state = 'none';
    item.classList.remove('state-must', 'state-nice');
    item.classList.add('state-none');
    item.style.backgroundColor = '';
  });

  updateSelectedCount();
  displayHeadsets(headsets); // Show all headsets
}

function initializeFavoriteButtons() {
  document.querySelectorAll('.favorite-button').forEach(button => {
    button.addEventListener('click', function () {
      const headsetId = this.dataset.headsetId;
      toggleFavorite(headsetId, this);
    });
  });
}

function toggleFavorite(headsetId, button) {
  const index = favorites.indexOf(headsetId);
  const isFavorite = index > -1;

  if (isFavorite) {
    favorites.splice(index, 1);
    button.classList.remove('bg-red-50', 'border-red-300');
  } else {
    favorites.push(headsetId);
    button.classList.add('bg-red-50', 'border-red-300');
  }

  // Update icons
  const icon = button.querySelector('.favorite-icon');
  const iconFilled = button.querySelector('.favorite-icon-filled');

  if (icon && iconFilled) {
    if (isFavorite) {
      icon.classList.remove('hidden');
      icon.classList.add('text-gray-400');
      iconFilled.classList.add('hidden');
      iconFilled.classList.remove('text-red-500');
    } else {
      icon.classList.add('hidden');
      icon.classList.remove('text-gray-400');
      iconFilled.classList.remove('hidden');
      iconFilled.classList.add('text-red-500');
    }
  }

  // Save to localStorage
  localStorage.setItem('headsetFavorites', JSON.stringify(favorites));
}

function exportFavorites() {
  const exportData = {
    favorites: favorites,
    exportDate: new Date().toISOString(),
    version: "1.0"
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `headset-favorites-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importFavorites(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importData = JSON.parse(e.target.result);
      if (importData.favorites && Array.isArray(importData.favorites)) {
        favorites = importData.favorites;
        localStorage.setItem('headsetFavorites', JSON.stringify(favorites));

        // Refresh the display to show updated favorites
        displayHeadsets(headsets);

        alert('Favorites imported successfully!');
      } else {
        alert('Invalid favorites file format.');
      }
    } catch (error) {
      alert('Error importing favorites file.');
    }
  };
  reader.readAsText(file);

  // Reset the file input
  event.target.value = '';
}