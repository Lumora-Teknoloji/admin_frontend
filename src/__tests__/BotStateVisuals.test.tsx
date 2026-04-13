import React from 'react';
import { getModeTheme, getStateVisuals, getStatusInfo } from '../components/bot-card/BotStateVisuals';

describe('BotStateVisuals Configuration Resolvers', () => {
  describe('getModeTheme', () => {
    it('should return correct theme for worker mode', () => {
      const theme = getModeTheme('worker');
      expect(theme.accentColor).toBe('amber');
      expect(theme.badgeLabel).toBe('WORKER');
      expect(theme.btnStart).toContain('amber');
    });

    it('should return correct theme for linker mode', () => {
      const theme = getModeTheme('linker');
      expect(theme.accentColor).toBe('purple');
      expect(theme.badgeLabel).toBe('LINKER');
      expect(theme.btnStart).toContain('purple');
    });

    it('should fallback to normal theme for unknown mode', () => {
      const theme = getModeTheme('unknown_mode_123');
      expect(theme.accentColor).toBe('emerald');
      expect(theme.badgeLabel).toBe('NORMAL');
    });
  });

  describe('getStateVisuals', () => {
    it('should return visual configs for known states', () => {
      const visuals = getStateVisuals('speed_mode');
      expect(visuals).not.toBeNull();
      expect(visuals?.bannerLabel).toContain('HIZ MODU AKTİF');
      expect(visuals?.dotColor).toBe('bg-fuchsia-500');
    });

    it('should return null for non-configured or normal states', () => {
      expect(getStateVisuals('scraping')).toBeNull();
      expect(getStateVisuals('idle')).toBeNull();
      expect(getStateVisuals(undefined)).toBeNull();
    });
  });

  describe('getStatusInfo', () => {
    it('should override status if bot is critical', () => {
      const mockBot = { status: 'running' as any, is_critical: true };
      const statusInfo = getStatusInfo(mockBot as any);
      expect(statusInfo.color).toBe('red');
      expect(statusInfo.label).toBe('KRİTİK HATA');
    });

    it('should calculate specific status if alive', () => {
      const mockBot = { status: 'worker_running' as any, is_critical: false };
      const statusInfo = getStatusInfo(mockBot as any);
      expect(statusInfo.color).toBe('amber');
      expect(statusInfo.label).toBe('İŞLENİYOR');
    });

    it('should default to offline if status is unknown', () => {
      const mockBot = { status: 'weird_status' as any, is_critical: false };
      const statusInfo = getStatusInfo(mockBot as any);
      expect(statusInfo.color).toBe('slate');
      expect(statusInfo.label).toBe('PASİF / OFFLINE');
    });
  });
});
