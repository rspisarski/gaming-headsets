// Feature matching engine with custom scoring system
import { SelectedFeature, MatchResult, FeatureMatch } from './features.js';

// Scoring constants based on requirements:
// - If not must have then nothing should show
// - If 1 must have and 2 nice then score that as a 102
// - If 3 must have and 1 nice then score that as a 301
const MUST_HAVE_WEIGHT = 100;
const NICE_TO_HAVE_WEIGHT = 2;

export class FeatureMatcher {
  private selectedFeatures: SelectedFeature[] = [];

  setSelectedFeatures(features: SelectedFeature[]): void {
    this.selectedFeatures = features;
  }

  calculateMatch(headsetData: any): MatchResult {
    const mustHaveFeatures = this.selectedFeatures.filter(f => f.priority === 'must-have');
    const niceToHaveFeatures = this.selectedFeatures.filter(f => f.priority === 'nice-to-have');

    // If no must-have features selected, return empty match
    if (mustHaveFeatures.length === 0) {
      return {
        headsetId: headsetData.id,
        score: 0,
        matchType: 'none',
        mustHaveMatchCount: 0,
        niceToHaveMatchCount: 0,
        totalMustHave: mustHaveFeatures.length,
        totalNiceToHave: niceToHaveFeatures.length,
        matchedMustHave: [],
        matchedNiceToHave: [],
        missingMustHave: mustHaveFeatures.map(f => f.feature)
      };
    }

    const mustHaveMatches = this.matchFeatures(mustHaveFeatures, headsetData);
    const niceToHaveMatches = this.matchFeatures(niceToHaveFeatures, headsetData);

    const mustHaveMatchCount = mustHaveMatches.length;
    const niceToHaveMatchCount = niceToHaveMatches.length;
    const missingMustHave = mustHaveFeatures.filter(f => !mustHaveMatches.includes(f.feature));

    // If any must-have feature is missing, no match
    if (missingMustHave.length > 0) {
      return {
        headsetId: headsetData.id,
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

    // Calculate score using custom formula
    const score = this.calculateScore(mustHaveMatchCount, niceToHaveMatchCount);

    // Determine match type based on nice-to-have percentage
    const niceToHavePercentage = niceToHaveMatchCount / niceToHaveFeatures.length;
    let matchType: FeatureMatch;

    if (niceToHavePercentage >= 1.0) {
      matchType = 'complete';
    } else if (niceToHavePercentage >= 0.5) {
      matchType = 'majority';
    } else {
      matchType = 'partial';
    }

    return {
      headsetId: headsetData.id,
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

  private matchFeatures(selectedFeatures: SelectedFeature[], headsetData: any): string[] {
    const matches: string[] = [];
    
    for (const selected of selectedFeatures) {
      if (this.featureMatches(selected, headsetData)) {
        matches.push(selected.feature);
      }
    }
    
    return matches;
  }

  private featureMatches(selected: SelectedFeature, headsetData: any): boolean {
    const { feature, value } = selected;
    
    switch (feature) {
      case 'compatibility':
        return this.arrayMatches(value, headsetData.compatibility);
      case 'cord_type':
        return this.cordTypeMatches(value, headsetData);
      case 'microphone_type':
        return value === headsetData.microphone_type;
      case 'noise_cancellation':
        return this.noiseCancellationMatches(value, headsetData);
      case 'rgb_lighting':
        return this.rgbLightingMatches(value, headsetData);
      case 'software_support':
        return this.softwareSupportMatches(value, headsetData);
      case 'software_app':
        return value === headsetData.software_app;
      case 'replaceable_earpads':
        return value === headsetData.replaceable_earpads;
      default:
        return false;
    }
  }

  private arrayMatches(selected: any[], actual: any[]): boolean {
    if (!Array.isArray(actual)) return false;
    return selected.some(item => actual.includes(item));
  }

  private cordTypeMatches(selected: any[], headsetData: any): boolean {
    const hasWireless = selected.includes('wireless') && headsetData.wireless;
    const hasWired = selected.includes('wired') && headsetData.wired;
    const hasDual = selected.includes('dual') && headsetData.wireless && headsetData.wired;
    
    return hasWireless || hasWired || hasDual;
  }

  private noiseCancellationMatches(selected: string, headsetData: any): boolean {
    switch (selected) {
      case 'false':
        return headsetData.noise_cancellation === 'false';
      case 'true':
        return headsetData.noise_cancellation !== 'false';
      case 'active':
        return headsetData.noise_cancellation === 'active';
      case 'pass through':
        return headsetData.noise_cancellation === 'pass through';
      case 'open back':
        return headsetData.noise_cancellation === 'open back';
      default:
        return false;
    }
  }

  private rgbLightingMatches(selected: string, headsetData: any): boolean {
    switch (selected) {
      case 'false':
        return headsetData.rgb_lighting === 'false';
      case 'true':
        return headsetData.rgb_lighting === 'true';
      default:
        return false;
    }
  }

  private softwareSupportMatches(selected: string, headsetData: any): boolean {
    switch (selected) {
      case 'none':
        return !headsetData.software_support || headsetData.software_support === 'none';
      case 'basic':
        return headsetData.software_support === 'basic';
      case 'advanced':
        return headsetData.software_support === 'advanced';
      default:
        return false;
    }
  }

  private calculateScore(mustHaveCount: number, niceToHaveCount: number): number {
    // Custom scoring formula based on requirements:
    // - 1 must have + 2 nice = 102
    // - 3 must have + 1 nice = 301
    const baseScore = (mustHaveCount * MUST_HAVE_WEIGHT) + (niceToHaveCount * NICE_TO_HAVE_WEIGHT);
    return baseScore;
  }

  // Sort matches by score and match type
  static sortMatches(matches: MatchResult[]): MatchResult[] {
    return matches.sort((a, b) => {
      // First sort by match type priority
      const matchTypeOrder = { 'complete': 3, 'majority': 2, 'partial': 1, 'none': 0 };
      const typeDiff = matchTypeOrder[b.matchType] - matchTypeOrder[a.matchType];
      if (typeDiff !== 0) return typeDiff;
      
      // Then sort by score (descending)
      return b.score - a.score;
    });
  }

  // Filter matches by type
  static filterByMatchType(matches: MatchResult[], matchType: FeatureMatch): MatchResult[] {
    return matches.filter(match => match.matchType === matchType);
  }
}

export default FeatureMatcher;