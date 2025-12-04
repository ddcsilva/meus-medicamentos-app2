import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'meus-medicamentos-theme';

/**
 * Serviço de gerenciamento de tema (light/dark mode).
 * 
 * Funcionalidades:
 * - Persiste preferência no localStorage
 * - Respeita preferência do sistema na primeira visita
 * - Sincroniza com atributo data-theme no HTML
 * - Expõe signal reativo para uso em componentes
 * 
 * @example
 * // Em um componente
 * readonly themeService = inject(ThemeService);
 * 
 * // Acessar tema atual
 * isDark = computed(() => this.themeService.theme() === 'dark');
 * 
 * // Alternar tema
 * toggleTheme() {
 *   this.themeService.toggle();
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  
  /** Signal com o tema atual */
  private readonly _theme = signal<Theme>(this.getInitialTheme());
  
  /** Tema atual (readonly) */
  readonly theme = this._theme.asReadonly();
  
  constructor() {
    // Effect para sincronizar tema com o DOM
    effect(() => {
      this.applyTheme(this._theme());
    });
  }
  
  /**
   * Obtém o tema inicial baseado em:
   * 1. Preferência salva no localStorage
   * 2. Preferência do sistema operacional
   * 3. Fallback para 'light'
   */
  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }
    
    // Verificar localStorage
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // Verificar preferência do sistema
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }
  
  /**
   * Aplica o tema ao documento HTML.
   */
  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualizar meta theme-color para mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#0d9488');
    }
    
    // Persistir no localStorage
    localStorage.setItem(THEME_KEY, theme);
  }
  
  /**
   * Define o tema.
   */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }
  
  /**
   * Alterna entre light e dark.
   */
  toggle(): void {
    this._theme.update(current => current === 'light' ? 'dark' : 'light');
  }
  
  /**
   * Verifica se o tema atual é dark.
   */
  isDark(): boolean {
    return this._theme() === 'dark';
  }
  
  /**
   * Verifica se o tema atual é light.
   */
  isLight(): boolean {
    return this._theme() === 'light';
  }
}

