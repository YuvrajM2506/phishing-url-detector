/**
 * Safe URL parsing and feature extraction utility
 */
export function parseUrl(rawUrl) {
  let cleanedUrl = (rawUrl || '').trim();
  if (!cleanedUrl) {
    throw new Error('Please enter a URL to scan.');
  }

  // Prepend protocol if missing for URL parser
  let hasProtocol = /^https?:\/\//i.test(cleanedUrl);
  let urlToParse = hasProtocol ? cleanedUrl : `http://${cleanedUrl}`;

  try {
    const parsed = new URL(urlToParse);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;
    const protocol = parsed.protocol.replace(':', '').toLowerCase();
    const port = parsed.port;
    const search = parsed.search;
    const hash = parsed.hash;

    // Extract subdomains and domain
    const hostParts = hostname.split('.');
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || /^\[[a-f0-9:]+\]$/i.test(hostname);
    
    let tld = '';
    let domain = hostname;
    let subdomains = [];

    if (!isIp && hostParts.length >= 2) {
      tld = '.' + hostParts[hostParts.length - 1];
      // Handle compound TLDs like .co.uk, .com.br, etc.
      if (hostParts.length >= 3 && ['co', 'com', 'org', 'net', 'edu', 'gov'].includes(hostParts[hostParts.length - 2])) {
        tld = '.' + hostParts[hostParts.length - 2] + tld;
        domain = hostParts[hostParts.length - 3] + tld;
        subdomains = hostParts.slice(0, hostParts.length - 3);
      } else {
        domain = hostParts[hostParts.length - 2] + tld;
        subdomains = hostParts.slice(0, hostParts.length - 2);
      }
    }

    return {
      raw: rawUrl,
      clean: cleanedUrl,
      normalized: urlToParse,
      hostname,
      domain,
      subdomains,
      subdomainCount: subdomains.length,
      tld,
      pathname,
      protocol,
      port,
      search,
      hash,
      isIp,
      hasHttps: protocol === 'https',
    };
  } catch (err) {
    throw new Error('Invalid URL format. Please enter a valid web address.');
  }
}

/**
 * Calculates Shannon Entropy for a given string (detects algorithmic or random domain names)
 */
export function calculateEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}
