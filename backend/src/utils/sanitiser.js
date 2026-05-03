const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    // Basic sanitization: strip HTML and potentially dangerous characters
    // This is a simple version, in production use a library like DOMPurify or sanitize-html
    return input
        .replace(/<[^>]*>?/gm, '') // Strip HTML
        .trim();
};

module.exports = { sanitizeInput };
