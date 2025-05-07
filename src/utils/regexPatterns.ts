
export const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;

// Matches common phone formats including international
export const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

// Generic ID patterns (SSN, etc)
export const ID_REGEX = /\b([A-Z]{2}\d{6}[A-Z]?|\d{3}[-\s]?\d{2}[-\s]?\d{4})\b/g;

// General address pattern
export const ADDRESS_REGEX = /\b\d+\s+[A-Za-z\s,]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}\s*\d{5}\b/g;

// Tracking URLs
export const TRACKING_URL_REGEX = /\b(https?:\/\/)?([A-Za-z0-9-]+\.)*(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd)\/[A-Za-z0-9-_]+\b/g;

// URLs with UTM parameters
export const UTM_URL_REGEX = /\b(https?:\/\/[^\s]+[?&]utm_[^\s"']+)/g;

// Sensitive keywords
export const SENSITIVE_KEYWORDS_REGEX = /\b(password|ssn|salary|bank\saccount|routing|secret|private|confidential|dob|birthdate|birth\sdate|home\saddress)\b/gi;

export type RiskType = 'email' | 'phone' | 'id' | 'address' | 'trackingUrl' | 'sensitiveKeyword';

export type RiskSeverity = 'high' | 'medium' | 'low';

export interface RiskMatch {
  type: RiskType;
  severity: RiskSeverity;
  match: string;
  index: number;
  length: number;
  tooltip: string;
}

export const RISK_CONFIGS: Record<RiskType, { 
  regex: RegExp, 
  severity: RiskSeverity,
  tooltip: string 
}> = {
  email: {
    regex: EMAIL_REGEX,
    severity: 'high',
    tooltip: 'Sharing email addresses may lead to spam or phishing attempts.'
  },
  phone: {
    regex: PHONE_REGEX,
    severity: 'high',
    tooltip: 'Phone numbers can be used for unwanted calls or SMS spam.'
  },
  id: {
    regex: ID_REGEX,
    severity: 'high',
    tooltip: 'ID numbers can lead to identity theft if exposed.'
  },
  address: {
    regex: ADDRESS_REGEX,
    severity: 'medium',
    tooltip: 'Physical addresses should be shared cautiously to protect privacy.'
  },
  trackingUrl: {
    regex: new RegExp(`${TRACKING_URL_REGEX.source}|${UTM_URL_REGEX.source}`, 'g'),
    severity: 'medium',
    tooltip: 'Tracking URLs can be used to monitor clicks and gather user data.'
  },
  sensitiveKeyword: {
    regex: SENSITIVE_KEYWORDS_REGEX,
    severity: 'medium',
    tooltip: 'This content contains sensitive information that should be protected.'
  }
};
