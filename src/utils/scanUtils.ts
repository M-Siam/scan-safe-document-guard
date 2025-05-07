
import { RISK_CONFIGS, RiskMatch, RiskType } from './regexPatterns';

export function scanText(text: string): RiskMatch[] {
  const matches: RiskMatch[] = [];
  
  // Scan for each risk type
  Object.entries(RISK_CONFIGS).forEach(([type, config]) => {
    const { regex, severity, tooltip } = config;
    
    // Reset regex lastIndex to ensure it starts from the beginning
    regex.lastIndex = 0;
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        type: type as RiskType,
        severity,
        match: match[0],
        index: match.index,
        length: match[0].length,
        tooltip
      });
    }
  });
  
  // Sort matches by index to maintain order
  return matches.sort((a, b) => a.index - b.index);
}

export function calculatePrivacyScore(text: string, matches: RiskMatch[]): number {
  if (!text || text.length === 0) return 100;
  
  // Start with a perfect score
  let score = 100;
  
  // Group matches by risk type
  const riskCounts = matches.reduce((acc, match) => {
    acc[match.type] = (acc[match.type] || 0) + 1;
    return acc;
  }, {} as Record<RiskType, number>);
  
  // Penalize score based on risk severity and count
  Object.entries(riskCounts).forEach(([type, count]) => {
    const riskType = type as RiskType;
    const { severity } = RISK_CONFIGS[riskType];
    
    // Different penalties based on risk severity
    const penaltyMap = {
      high: 15,
      medium: 10,
      low: 5
    };
    
    // Calculate penalty (increasing but diminishing with count)
    const basePenalty = penaltyMap[severity];
    const countFactor = Math.log(count + 1) / Math.log(2); // logarithmic scaling
    
    // Apply penalty
    score -= basePenalty * countFactor;
  });
  
  // Apply additional penalty for short texts with high risk density
  const textLength = text.length;
  const totalMatches = matches.length;
  if (textLength < 1000 && totalMatches > 0) {
    const densityPenalty = Math.min(20, 20 * (totalMatches / (textLength / 100)));
    score -= densityPenalty;
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 70) return 'low';
  if (score >= 40) return 'medium';
  return 'high';
}

export function sanitizeText(text: string, matches: RiskMatch[]): string {
  // Sort matches in reverse to avoid index shifting when replacing
  const sortedMatches = [...matches].sort((a, b) => b.index - a.index);
  
  let sanitizedText = text;
  
  sortedMatches.forEach(match => {
    let replacement = '';
    
    switch(match.type) {
      case 'email':
        replacement = '[REDACTED EMAIL]';
        break;
      case 'phone':
        replacement = '[REDACTED PHONE]';
        break;
      case 'id':
        replacement = '[REDACTED ID]';
        break;
      case 'address':
        replacement = '[REDACTED ADDRESS]';
        break;
      case 'trackingUrl':
        // For URLs, remove tracking parameters or replace entirely
        const url = match.match;
        if (url.includes('utm_')) {
          replacement = url.split('?')[0]; // Remove query parameters
        } else {
          replacement = '[REDACTED URL]';
        }
        break;
      case 'sensitiveKeyword':
        replacement = '[REDACTED]';
        break;
      default:
        replacement = '[REDACTED]';
    }
    
    sanitizedText = 
      sanitizedText.substring(0, match.index) + 
      replacement + 
      sanitizedText.substring(match.index + match.length);
  });
  
  return sanitizedText;
}
