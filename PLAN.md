# Implementation Plan for Lokers Project

Based on user requirements to fix vibecoded appearance, improve mobile UX, fix console errors, reduce bundle size, and ensure quality.

## Phase 1: Fix Console Errors and Lint Issues

### Task 1: Fix TypeScript Unused Variables
- Target: `@typescript-eslint/no-unused-vars` (44 occurrences)
- Approach: Review and remove unused variables or prefix with underscore

### Task 2: Fix Explicit Any Types
- Target: `@typescript-eslint/no-explicit-any` (39 occurrences)
- Approach: Replace `any` with proper types where possible

### Task 3: Fix React Hooks Purity
- Target: `react-hooks/purity` (9 occurrences)
- Approach: Ensure hooks are called only at top level

### Task 4: Fix Unescaped Entities
- Target: `react/no-unescaped-entities` (8 occurrences)
- Approach: Escape text content properly

### Task 5: Fix Next.js Img Element Usage
- Target: `@next/next/no-img-element` (5 occurrences)
- Approach: Replace `<img>` with Next.js Image component

### Task 6: Fix Require Imports
- Target: `@typescript-eslint/no-require-imports` (8 occurrences)
- Approach: Convert to ES6 imports

### Task 7: Fix Location Assign
- Target: `@next/next/no-location-assign-relative-destination` (2 occurrences)
- Approach: Use proper navigation methods

### Task 8: Fix Set State in Effect
- Target: `react-hooks/set-state-in-effect` (2 occurrences)
- Approach: Move state init outside effect or use useState directly

### Task 9: Fix Exhaustive Deps
- Target: `react-hooks/exhaustive-deps` (1 occurrence)
- Approach: Add missing dependencies or use useCallback/useMemo

### Task 10: Fix Prefer Const
- Target: `prefer-const` (2 occurrences)
- Approach: Change let to const where reassignment doesn't happen

## Phase 2: Improve UI/UX to Avoid Vibecoded Appearance

### Task 11: Remove Purple Gradient
- Search for CSS/background gradients with purple tones
- Replace with neutral or brand-appropriate colors

### Task 12: Remove Pill Shaped Buttons
- Find buttons with excessive border-radius
- Adjust to reasonable radius (4-8px)

### Task 13: Improve Hero Text
- Review homepage hero section text
- Make it clear, specific, and benefit-driven

### Task 14: Remove Emoji Icons
- Search for emoji characters in JSX/TSX
- Replace with proper icons from lucide-react or remove if decorative

### Task 15: Remove Em Dashes
- Search for — in content
- Replace with regular hyphens or rephrase

### Task 16: Reduce Scroll Animations
- Review framer-motion usage
- Remove excessive or distracting animations
- Keep only meaningful micro-interactions

### Task 17: Audit AI-Generated Content
- Review copy for generic AI-like phrases
- Make content more specific and human-sounding
- Replace placeholder AI images with real or illustrative graphics

### Task 18: Remove Cursor Animations
- Search for custom cursor implementations
- Remove or simplify to default behavior

## Phase 3: Mobile-First UI/UX Focus

### Task 19: Audit Mobile Responsiveness
- Test all pages on mobile breakpoints
- Ensure touch targets are adequate (min 48x48dp)
- Verify text readability on small screens

### Task 20: Optimize Navigation for Mobile
- Review mobile menu/hamburger implementation
- Ensure easy access to primary actions
- Consider bottom navigation for key mobile flows

### Task 21: Form Optimization for Mobile
- Review all forms (especially cover letter generator)
- Ensure proper input types (email, tel, etc.)
- Optimize keyboard appearance
- Make submit buttons easily reachable

### Task 22: Performance Optimization for Mobile
- Implement lazy loading for below-fold content
- Optimize image sizes for mobile
- Consider reducing animation complexity on mobile

## Phase 4: Bundle Size Reduction

### Task 23: Analyze Bundle Composition
- Run `next-bundle-analyzer` or similar
- Identify large dependencies

### Task 24: Optimize Large Dependencies
- Review framer-motion usage - consider if all features needed
- Check if zod can be tree-shaken better
- Review framer-motion and other animation libraries

### Task 25: Code Splitting
- Ensure dynamic imports for non-critical components
- Review route-based splitting
- Check for accidental shared dependencies

### Task 26: Asset Optimization
- Optimize images (next-image already helps)
- Consider SVG icons instead of font icons where appropriate
- Review font loading strategies

## Phase 5: Quality Assurance

### Task 27: Comprehensive Testing
- Test all user flows: registration, job browsing, cover letter generation
- Test error states and edge cases
- Verify mobile functionality across devices

### Task 28: Final Lint Check
- Run ESLint and ensure zero errors
- Address any remaining warnings appropriately

### Task 29: Build Verification
- Ensure production build succeeds
- Check for any runtime errors in production build

## Implementation Approach

I will work through these phases systematically, using the executing-plans skill to track progress. For each task:
1. Mark as in_progress
2. Complete the work following the specific approach
3. Run verifications as specified
4. Mark as completed

Before starting, I will raise any concerns about the plan. If no concerns, I will proceed with execution.

Note: This plan focuses on the specific complaints about vibecoded appearance while addressing the underlying technical quality issues.