import { describe, expect, it } from 'vitest';
import { useTranslations, localizedHref, swapLocaleHref } from './utils';

describe('useTranslations', () => {
  it('returns the key in the requested locale', () => {
    const t = useTranslations('es');
    expect(t('nav.home')).toBe('Inicio');
  });

  it('returns English for the default locale', () => {
    const t = useTranslations('en');
    expect(t('nav.home')).toBe('Home');
  });
});

describe('localizedHref', () => {
  it('leaves the default locale (en) unprefixed', () => {
    expect(localizedHref('en', '/pokedex/')).toBe('/pokedex/');
  });

  it('prefixes non-default locales with /es', () => {
    expect(localizedHref('es', '/pokedex/')).toBe('/es/pokedex/');
  });

  it('prefixes the root path too', () => {
    expect(localizedHref('es', '/')).toBe('/es/');
  });
});

describe('swapLocaleHref', () => {
  it('adds /es when swapping from en to es', () => {
    expect(swapLocaleHref('es', '/areas/withered-wasteland/')).toBe(
      '/es/areas/withered-wasteland/',
    );
  });

  it('strips /es when swapping from es to en', () => {
    expect(swapLocaleHref('en', '/es/areas/withered-wasteland/')).toBe(
      '/areas/withered-wasteland/',
    );
  });

  it('maps /es (no trailing slash) back to the en root', () => {
    expect(swapLocaleHref('en', '/es')).toBe('/');
  });

  it('is idempotent for the root path', () => {
    expect(swapLocaleHref('es', '/')).toBe('/es/');
    expect(swapLocaleHref('en', '/')).toBe('/');
  });
});
