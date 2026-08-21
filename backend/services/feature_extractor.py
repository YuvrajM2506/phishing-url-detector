from urllib.parse import urlparse, parse_qs
import re
import ipaddress


FEATURE_COLUMNS = [
    "url_length",
    "domain_length",
    "num_dots",
    "num_hyphens",
    "num_underscores",
    "num_digits",
    "num_letters",
    "num_special_chars",
    "num_subdomains",
    "num_path_segments",
    "num_query_params",
    "num_at_symbols",
    "num_equals",
    "num_ampersands",
    "has_ip",
    "has_https",
    "num_suspicious_keywords",
    "has_url_encoding",
    "has_double_slash_path",
    "has_port",
]


SUSPICIOUS_KEYWORDS = [
    "login",
    "signin",
    "verify",
    "verification",
    "account",
    "update",
    "secure",
    "security",
    "password",
    "confirm",
    "bank",
    "billing",
    "payment",
    "wallet",
    "recover",
]


def is_ip_address(hostname):
    if not hostname:
        return 0

    try:
        ipaddress.ip_address(hostname)
        return 1
    except ValueError:
        return 0


def extract_features(url):
    """
    Extract URL-only phishing detection features.
    These features can be calculated without visiting the website.
    """

    # Add scheme if missing
    normalized_url = url.strip()

    if not normalized_url.startswith(("http://", "https://")):
        normalized_url = "http://" + normalized_url

    parsed = urlparse(normalized_url)

    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""

    # -----------------------------
    # Basic character features
    # -----------------------------

    url_length = len(normalized_url)

    domain_length = len(hostname)

    num_dots = normalized_url.count(".")

    num_hyphens = normalized_url.count("-")

    num_underscores = normalized_url.count("_")

    num_digits = sum(
        character.isdigit()
        for character in normalized_url
    )

    num_letters = sum(
        character.isalpha()
        for character in normalized_url
    )

    num_special_chars = sum(
        not character.isalnum()
        for character in normalized_url
    )

    # -----------------------------
    # Domain features
    # -----------------------------

    domain_parts = hostname.split(".")

    num_subdomains = max(
        len(domain_parts) - 2,
        0
    )

    # -----------------------------
    # Path features
    # -----------------------------

    path_segments = [
        segment
        for segment in path.split("/")
        if segment
    ]

    num_path_segments = len(path_segments)

    # -----------------------------
    # Query features
    # -----------------------------

    query_params = parse_qs(query)

    num_query_params = len(query_params)

    num_equals = normalized_url.count("=")

    num_ampersands = normalized_url.count("&")

    # -----------------------------
    # Suspicious characters
    # -----------------------------

    num_at_symbols = normalized_url.count("@")

    # -----------------------------
    # Security features
    # -----------------------------

    has_ip = is_ip_address(hostname)

    has_https = int(parsed.scheme.lower() == "https")

    # -----------------------------
    # Suspicious keywords
    # -----------------------------

    url_lower = normalized_url.lower()

    num_suspicious_keywords = sum(
        1
        for keyword in SUSPICIOUS_KEYWORDS
        if keyword in url_lower
    )

    # -----------------------------
    # Encoding
    # -----------------------------

    has_url_encoding = int(
        bool(re.search(r"%[0-9a-fA-F]{2}", normalized_url))
    )

    # -----------------------------
    # Double slash in path
    # -----------------------------

    has_double_slash_path = int(
        "//" in path
    )

    # -----------------------------
    # Port
    # -----------------------------

    try:
        has_port = int(parsed.port is not None)
    except ValueError:
        has_port = 0

    return {
        "url_length": url_length,
        "domain_length": domain_length,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_underscores": num_underscores,
        "num_digits": num_digits,
        "num_letters": num_letters,
        "num_special_chars": num_special_chars,
        "num_subdomains": num_subdomains,
        "num_path_segments": num_path_segments,
        "num_query_params": num_query_params,
        "num_at_symbols": num_at_symbols,
        "num_equals": num_equals,
        "num_ampersands": num_ampersands,
        "has_ip": has_ip,
        "has_https": has_https,
        "num_suspicious_keywords": num_suspicious_keywords,
        "has_url_encoding": has_url_encoding,
        "has_double_slash_path": has_double_slash_path,
        "has_port": has_port,
    }


def features_as_list(url):
    features = extract_features(url)

    return [
        features[column]
        for column in FEATURE_COLUMNS
    ]