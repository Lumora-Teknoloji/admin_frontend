# TODO: Codebase Improvement Plan

## 🚨 Critical Architecture (God Objects)
- [ ] **Split `src/components/BotCard.tsx`**: Current size is 1206 lines. This React component is too large; split it into smaller sub-components.

## 🛡️ Type Safety
- [ ] **Fix `any` types in `useDashboard.ts`**: 8 instances of `: any` need proper TypeScript interfaces.
- [ ] **Fix `any` types in `AgentCard.tsx`**: 4 instances of `: any` need proper TypeScript interfaces.

## 🧹 Maintenance (Logging)
- [ ] **Clean `check_health.js`**: Remove 11 forgotten `console.log` statements.
