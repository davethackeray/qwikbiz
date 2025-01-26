# PR: Fix JSON Parsing Issues in AI Service

## Problem
Multiple JSON parsing errors occurring when processing Gemini API responses:
1. SyntaxError at position 31
2. Issues with nested quotes in JSON strings
3. Parsing failures with complex business scenarios

## Solution
Enhanced the `cleanJsonString` function with multiple improvements:
1. Multi-stage cleaning process
2. Smart quote handling
3. Proper quote escaping
4. Enhanced error logging

### Technical Details
- Added quote normalization (smart quotes, backticks)
- Implemented triple-pass quote escaping
- Added state preservation for already escaped quotes
- Enhanced error diagnostics for debugging

## Testing
- Verified with complex business scenarios
- Tested nested quote handling
- Confirmed proper error logging
- Validated with invalid JSON responses

## Related Issues
- JSON parsing errors in console
- Business scenario generation failures
- Quote escaping issues in AI responses

## Commit History
- feat: enhance JSON cleaning with robust quote handling
- docs: add comprehensive JSDoc documentation
- fix: improve error logging for debugging

## Files Changed
- src/lib/services/ai.ts

## Reviewers
@davethackeray

## Notes
- Consider adding automated tests for JSON cleaning
- Monitor error logs for any new parsing issues
- May need to update API prompt engineering in future
