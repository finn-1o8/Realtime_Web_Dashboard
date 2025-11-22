# Security Documentation

This document outlines the security measures implemented in the System Monitoring Dashboard and best practices for maintaining security.

## Security Measures Implemented

### 1. CORS Configuration
- **Issue Fixed**: Previously allowed all origins (`origin: '*'`)
- **Solution**: Implemented origin whitelist based on environment variables
- **Configuration**: 
  - Development: Allows `http://localhost:3000` and `http://localhost:5173`
  - Production: Requires `CORS_ORIGIN` environment variable
- **Location**: `server/index.ts`

### 2. Input Validation and Sanitization
- **Issue Fixed**: No validation on user input from `req.body`, `req.params`, or `req.query`
- **Solution**: 
  - Added `validateId()` function to validate IDs (alphanumeric, underscore, hyphen, max 100 chars)
  - Added `validateCameraSettings()` to validate camera settings with type and range checks
  - Added `validateRecordingConfig()` to validate recording configurations
  - Added `sanitizeString()` to sanitize string inputs
- **Location**: `server/index.ts`

### 3. Security Headers
- **Headers Added**:
  - `X-Frame-Options: DENY` - Prevents clickjacking
  - `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
  - `X-XSS-Protection: 1; mode=block` - Enables XSS protection
  - `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
  - `Content-Security-Policy` - Restricts resource loading
  - `Strict-Transport-Security` - Enforces HTTPS in production
- **Location**: `server/index.ts`, `index.html`

### 4. Rate Limiting
- **Issue Fixed**: No protection against DoS attacks
- **Solution**: Implemented rate limiting middleware
- **Configuration**:
  - Window: 15 minutes
  - Max requests: 100 per window per IP
  - Returns 429 status code when exceeded
- **Location**: `server/index.ts`

### 5. Request Body Size Limits
- **Configuration**: Limited to 10MB to prevent memory exhaustion attacks
- **Location**: `server/index.ts`

### 6. WebSocket Security
- **Issue Fixed**: No authentication/authorization on WebSocket connections
- **Solution**: 
  - Added authentication middleware placeholder
  - Added input validation for all WebSocket events
  - Validates camera settings, recording configs, and other inputs
- **Location**: `server/index.ts`

### 7. Type Safety
- **Implementation**: Full TypeScript implementation with strict mode
- **Benefits**: 
  - Compile-time type checking
  - Prevents type-related vulnerabilities
  - Better code quality

## Security Best Practices

### Environment Variables
Always use environment variables for sensitive configuration:

```env
# Required in production
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production
PORT=3001

# Security secrets (when implementing authentication)
JWT_SECRET=your-strong-secret-key-here
SESSION_SECRET=your-session-secret-here
```

### Authentication (To Be Implemented)
The codebase includes placeholders for authentication:
- JWT token validation in API interceptor (`src/services/api.ts`)
- WebSocket authentication middleware (`server/index.ts`)
- Token storage in localStorage (consider httpOnly cookies for production)

**Recommendation**: Implement proper authentication before production deployment.

### Input Validation
All user inputs are validated:
- IDs: Alphanumeric, underscore, hyphen only, max 100 chars
- Camera settings: Numeric values, range 0-1000
- Recording configs: Valid enum values and types
- Strings: Sanitized to remove potentially dangerous characters

### XSS Prevention
- No use of `dangerouslySetInnerHTML` or `innerHTML`
- React's default escaping prevents XSS
- Content Security Policy headers restrict script execution

### CSRF Protection
- Consider implementing CSRF tokens for state-changing operations
- Use SameSite cookies when implementing authentication

## Known Security Considerations

### 1. Authentication
- **Status**: Placeholder implementation
- **Action Required**: Implement proper JWT-based authentication before production
- **Location**: `src/services/api.ts`, `server/index.ts`

### 2. HTTPS Enforcement
- **Status**: HSTS header configured for production
- **Action Required**: Ensure HTTPS is properly configured in production environment
- **Note**: Development uses HTTP (acceptable for local development)

### 3. Token Storage
- **Status**: Tokens stored in localStorage
- **Risk**: Vulnerable to XSS attacks
- **Recommendation**: Consider httpOnly cookies for production (requires backend changes)

### 4. Rate Limiting
- **Status**: Basic in-memory rate limiting implemented
- **Limitation**: Does not work across multiple server instances
- **Recommendation**: Use Redis-based rate limiting for distributed systems

### 5. Logging and Monitoring
- **Status**: Basic console logging
- **Recommendation**: Implement structured logging and monitoring in production
- **Consider**: Add security event logging (failed auth attempts, rate limit violations)

## Security Checklist for Production

Before deploying to production, ensure:

- [ ] `CORS_ORIGIN` environment variable is set with allowed origins
- [ ] `NODE_ENV=production` is set
- [ ] HTTPS is configured and enforced
- [ ] Authentication is implemented and tested
- [ ] All secrets are stored in environment variables (never in code)
- [ ] Rate limiting is configured appropriately
- [ ] Security headers are verified (use securityheaders.com)
- [ ] Dependencies are up to date (`npm audit`)
- [ ] Error messages don't leak sensitive information
- [ ] Logging doesn't include sensitive data
- [ ] Database connections use SSL/TLS
- [ ] File uploads (if any) are validated and scanned
- [ ] Regular security audits are scheduled

## Dependency Security

Regularly check for vulnerable dependencies:

```bash
npm audit
npm audit fix
```

**Current Status**: 
- 2 moderate severity vulnerabilities remain (esbuild - development only)
- These are in development dependencies and don't affect production builds
- Consider updating Vite to v7+ for full resolution (breaking change)

## Reporting Security Issues

If you discover a security vulnerability, please:
1. Do not open a public issue
2. Contact the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

