import { parseUrl, calculateEntropy } from '../utils/urlParser';

// High-risk brand impersonation targets
const KNOWN_BRANDS = [
  'paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook', 'meta',
  'netflix', 'chase', 'wellsfargo', 'bankofamerica', 'citibank', 'instagram',
  'twitter', 'x', 'linkedin', 'github', 'binance', 'coinbase', 'metamask',
  'dropbox', 'adobe', 'walmart', 'ebay', 'steam', 'roblox', 'telegram', 'whatsapp'
];

// Suspicious Top Level Domains commonly abused in phishing
const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.tk', '.zip', '.mov', '.fit', '.work', '.click', 
  '.gq', '.cf', '.ml', '.ga', '.surf', '.stream', '.rest', '.country', 
  '.buzz', '.icu', '.monster', '.support', '.cam', '.cfd', '.sbs'
];

// Legitimate domains that are usually safe when root domain matches exactly
const TRUSTED_DOMAINS = [
  'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'wikipedia.org',
  'apple.com', 'microsoft.com', 'github.com', 'linkedin.com', 'netflix.com',
  'twitter.com', 'x.com', 'reddit.com', 'instagram.com', 'cloudflare.com',
  'paypal.com', 'chase.com', 'bankofamerica.com', 'stackoverflow.com', 'openai.com'
];

// Common URL shorteners
const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'cutt.ly', 'rb.gy', 'ow.ly', 
  'buff.ly', 'rebrand.ly', 'goo.gl', 't.me'
];

// High-risk keywords
const PHISHING_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'verify', 'verification', 'account',
  'security', 'update', 'banking', 'secure', 'wallet', 'recover', 'recovery',
  'password', 'confirm', 'confirmation', 'credential', 'auth', 'authenticate',
  'billing', 'invoice', 'validation', 'validate', 'suspension', 'unusual-activity',
  'free-gift', 'prize', 'airdrop', 'crypto-bonus'
];

/**
 * Analyzes a URL using rule-based heuristic threat intelligence
 */
export function analyzeUrlHeuristics(rawUrl) {
  const parsed = parseUrl(rawUrl);
  const flags = [];
  let score = 0;

  const urlLower = parsed.normalized.toLowerCase();
  const domainLower = parsed.domain.toLowerCase();
  const hostnameLower = parsed.hostname.toLowerCase();
  const pathnameLower = parsed.pathname.toLowerCase();

  // 1. IP Address Check
  if (parsed.isIp) {
    score += 45;
    flags.push({
      id: 'ip_hostname',
      severity: 'high',
      title: 'Direct IP Address Used as Hostname',
      description: 'Legitimate websites almost always use domain names. Using a raw IP address (e.g. ' + parsed.hostname + ') is a classic hallmark of phishing hosts.',
      scoreImpact: +45,
      category: 'Network & Host'
    });
  }

  // 2. "@" Symbol in URL Check (Credential spoofing / Open redirect)
  if (parsed.clean.includes('@')) {
    score += 40;
    flags.push({
      id: 'at_symbol',
      severity: 'high',
      title: 'Embedded "@" Character Detected',
      description: 'Browsers treat anything before "@" as basic authentication credentials and navigate to the domain after the "@", frequently used to deceive users.',
      scoreImpact: +40,
      category: 'URL Structure'
    });
  }

  // 3. Double Slashes in Path
  if (parsed.pathname.includes('//')) {
    score += 30;
    flags.push({
      id: 'double_slash_path',
      severity: 'high',
      title: 'Suspicious Double Slashes in Path ("//")',
      description: 'Multiple slashes inside the URL path can be utilized to execute open redirects or bypass web application firewalls.',
      scoreImpact: +30,
      category: 'URL Structure'
    });
  }

  // 4. Check for URL Shorteners
  if (SHORTENERS.includes(parsed.domain) || SHORTENERS.includes(parsed.hostname)) {
    score += 25;
    flags.push({
      id: 'url_shortener',
      severity: 'medium',
      title: 'URL Shortening Service Detected',
      description: `The URL uses a shortener (${parsed.domain}) which masks the final destination. Attackers frequently use shorteners to hide malicious URLs.`,
      scoreImpact: +25,
      category: 'Redirection'
    });
  }

  // 5. Suspicious TLD check
  const matchedTld = SUSPICIOUS_TLDS.find(tld => parsed.hostname.endsWith(tld));
  if (matchedTld) {
    score += 30;
    flags.push({
      id: 'suspicious_tld',
      severity: 'high',
      title: `High-Risk Top-Level Domain (${matchedTld})`,
      description: `The domain uses "${matchedTld}", a TLD statistically known for high rates of spam, phishing, and disposable domain abuse.`,
      scoreImpact: +30,
      category: 'Domain Reputation'
    });
  }

  // 6. Brand Impersonation / Typosquatting Check
  let brandSpoofed = null;
  for (const brand of KNOWN_BRANDS) {
    // Check if brand is in hostname but NOT the exact root domain
    const isRootBrand = domainLower === `${brand}.com` || domainLower === `${brand}.org` || domainLower === `${brand}.net`;
    
    // Typosquatting checks: e.g. paypa1, micros0ft, goog1e, arnazon
    const typosquatRegexes = [
      new RegExp(brand.replace(/l/g, '[1li|]').replace(/o/g, '[0o]').replace(/m/g, '(?:rn|m)').replace(/a/g, '[@a4]'), 'i')
    ];

    const hasDirectBrandMention = hostnameLower.includes(brand);
    const hasTyposquatMatch = !isRootBrand && typosquatRegexes.some(r => r.test(hostnameLower));

    if (!isRootBrand && (hasDirectBrandMention || hasTyposquatMatch)) {
      brandSpoofed = brand;
      break;
    }
  }

  if (brandSpoofed) {
    score += 45;
    flags.push({
      id: 'brand_impersonation',
      severity: 'high',
      title: `Target Brand Impersonation (${brandSpoofed.toUpperCase()})`,
      description: `The URL references well-known brand "${brandSpoofed}" in a suspicious hostname (${parsed.hostname}) that is not the brand's verified root domain.`,
      scoreImpact: +45,
      category: 'Brand Threat'
    });
  }

  // 7. Sensitive Keywords in URL Path & Subdomains
  const matchedKeywords = PHISHING_KEYWORDS.filter(kw => urlLower.includes(kw));
  if (matchedKeywords.length > 0) {
    const keywordWeight = Math.min(matchedKeywords.length * 12, 35);
    score += keywordWeight;
    flags.push({
      id: 'phishing_keywords',
      severity: matchedKeywords.length >= 2 ? 'high' : 'medium',
      title: `Sensitive Action Keywords Detected (${matchedKeywords.slice(0, 4).join(', ')})`,
      description: `URL contains sensitive authentication/security keywords commonly used on phishing landing pages to harvest credentials.`,
      scoreImpact: +keywordWeight,
      category: 'Content Analysis'
    });
  }

  // 8. Excessive Hyphens in Domain
  const hyphenCount = (parsed.hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 25;
    flags.push({
      id: 'excessive_hyphens',
      severity: 'medium',
      title: `Excessive Hyphens in Domain (${hyphenCount} found)`,
      description: 'Attackers often chain multiple words with hyphens (e.g., paypal-secure-update-login) to construct deceptive domain names.',
      scoreImpact: +25,
      category: 'Domain Syntax'
    });
  } else if (hyphenCount >= 1 && (matchedKeywords.length > 0 || brandSpoofed)) {
    score += 15;
    flags.push({
      id: 'hyphen_keyword_combo',
      severity: 'medium',
      title: 'Hyphenated Domain with Sensitive Terms',
      description: 'Domain combines hyphens with security/brand keywords.',
      scoreImpact: +15,
      category: 'Domain Syntax'
    });
  }

  // 9. Subdomain Depth / Excessive Subdomains
  if (parsed.subdomainCount >= 3) {
    score += 25;
    flags.push({
      id: 'excessive_subdomains',
      severity: 'medium',
      title: `Unusual Subdomain Depth (${parsed.subdomainCount} levels)`,
      description: `Excessive subdomains (${parsed.subdomains.join('.')}) are often deployed to camouflage real origin servers.`,
      scoreImpact: +25,
      category: 'DNS & Structure'
    });
  }

  // 10. URL Length Anomaly
  if (parsed.clean.length > 100) {
    score += 20;
    flags.push({
      id: 'extreme_url_length',
      severity: 'medium',
      title: `Excessive URL Length (${parsed.clean.length} characters)`,
      description: 'Unusually long URLs are frequently used to hide malicious payload parameters or push suspicious domain parts out of the browser address bar view.',
      scoreImpact: +20,
      category: 'URL Structure'
    });
  } else if (parsed.clean.length > 70) {
    score += 10;
    flags.push({
      id: 'high_url_length',
      severity: 'low',
      title: `Elevated URL Length (${parsed.clean.length} characters)`,
      description: 'URL length is higher than the average web page standard.',
      scoreImpact: +10,
      category: 'URL Structure'
    });
  }

  // 11. HTTPS / SSL Check
  if (!parsed.hasHttps) {
    // If it has sensitive keywords or other flags, missing HTTPS is a severe red flag
    const penalty = matchedKeywords.length > 0 ? 25 : 15;
    score += penalty;
    flags.push({
      id: 'unencrypted_http',
      severity: matchedKeywords.length > 0 ? 'high' : 'medium',
      title: 'Unencrypted Connection (Insecure HTTP)',
      description: 'The URL does not use SSL/TLS encryption (HTTPS). Any passwords or sensitive data transmitted over this link can be intercepted in plain text.',
      scoreImpact: +penalty,
      category: 'Security Protocol'
    });
  }

  // 12. Non-standard Port
  if (parsed.port && !['80', '443', '8080', '3000', '5173'].includes(parsed.port)) {
    score += 20;
    flags.push({
      id: 'non_standard_port',
      severity: 'medium',
      title: `Non-Standard Web Port (:${parsed.port})`,
      description: `The URL connects through port :${parsed.port} rather than standard HTTP(S) ports.`,
      scoreImpact: +20,
      category: 'Network & Host'
    });
  }

  // 13. Shannon Entropy Check
  const domainEntropy = calculateEntropy(parsed.hostname);
  if (domainEntropy > 4.1 && !parsed.isIp) {
    score += 20;
    flags.push({
      id: 'high_entropy',
      severity: 'medium',
      title: `High Domain Entropy (${domainEntropy})`,
      description: 'The hostname shows high character randomness, suggesting it might be generated by an automated Domain Generation Algorithm (DGA).',
      scoreImpact: +20,
      category: 'Entropy Analysis'
    });
  }

  // 14. Trusted Root Domain Bonus (Reduces false positives for known verified websites)
  const isTrustedRoot = TRUSTED_DOMAINS.includes(domainLower);
  if (isTrustedRoot && parsed.subdomainCount <= 1 && !parsed.clean.includes('@') && !parsed.pathname.includes('//')) {
    score = Math.max(0, Math.min(score, 10)); // Cap risk very low
  }

  // Final Score Normalization (0 to 100)
  score = Math.min(Math.max(score, 0), 100);

  // Determine Final Verdict
  let verdict = 'SAFE';
  let category = 'Safe';
  let statusBadge = '✅ Safe';
  let color = 'emerald';

  if (score >= 66) {
    verdict = 'HIGH_RISK';
    category = 'High Risk';
    statusBadge = '🚨 High Risk';
    color = 'rose';
  } else if (score >= 26) {
    verdict = 'SUSPICIOUS';
    category = 'Suspicious';
    statusBadge = '⚠️ Suspicious';
    color = 'amber';
  }

  // If safe with 0 flags, add a clean bill of health flag
  if (flags.length === 0) {
    flags.push({
      id: 'clean_heuristics',
      severity: 'info',
      title: 'Clean Structural Signature',
      description: 'Standard domain structure, valid HTTPS encryption, no known brand impersonation, and normal character distribution.',
      scoreImpact: 0,
      category: 'Integrity Check'
    });
  }

  // Generate plain-English AI threat summary
  let summary = '';
  if (verdict === 'HIGH_RISK') {
    summary = `CRITICAL WARNING: This URL exhibits severe indicators of phishing or malicious activity (Risk Score: ${score}/100). ` +
      `Key triggers include ${flags.filter(f => f.severity === 'high').map(f => f.title).join(', ') || 'multiple severe structural anomalies'}. ` +
      `Do NOT enter any passwords, credit card numbers, or download attachments from this destination.`;
  } else if (verdict === 'SUSPICIOUS') {
    summary = `CAUTION ADVISED: This URL exhibits several suspicious characteristics (Risk Score: ${score}/100). ` +
      `It may be an unverified domain, use obscured routing, or present lexical anomalies. Inspect the destination domain carefully before proceeding.`;
  } else {
    summary = `VERIFIED NORMAL: No critical phishing indicators were detected on this URL (Risk Score: ${score}/100). ` +
      `The domain follows standard naming conventions with proper HTTPS encryption and clean structure.`;
  }

  return {
    url: parsed.raw,
    cleanUrl: parsed.clean,
    score,
    verdict,
    category,
    statusBadge,
    color,
    summary,
    flags,
    metrics: {
      hostname: parsed.hostname,
      domain: parsed.domain,
      subdomains: parsed.subdomains,
      subdomainCount: parsed.subdomainCount,
      tld: parsed.tld || 'N/A',
      protocol: parsed.protocol.toUpperCase(),
      hasHttps: parsed.hasHttps,
      isIp: parsed.isIp,
      port: parsed.port || (parsed.hasHttps ? '443' : '80'),
      urlLength: parsed.clean.length,
      entropy: domainEntropy,
      hasAtSymbol: parsed.clean.includes('@'),
      hasDoubleSlashInPath: parsed.pathname.includes('//'),
      keywordHits: matchedKeywords,
    },
    scanTimestamp: new Date().toISOString(),
    engine: 'Heuristic & Lexical Analysis Engine v2.0',
    source: 'client_heuristic'
  };
}
