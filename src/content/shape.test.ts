import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Plain Node/fs checks against the raw content files — deliberately NOT going
// through astro:content (that requires the full Astro Vite pipeline). This
// still catches the failure modes that matter for a locale-mirrored content
// tree: missing translations, id drift between en/es, and duplicate ids.

const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)));
const JSON_ENTITIES = ['rules', 'pokedex', 'collectibles', 'recipes', 'milestones', 'endgame'];

function loadJson<T extends { id: string }>(locale: 'en' | 'es', name: string): T[] {
  return JSON.parse(readFileSync(join(CONTENT_DIR, locale, `${name}.json`), 'utf8')) as T[];
}

function areaFiles(locale: 'en' | 'es'): string[] {
  const dir = join(CONTENT_DIR, locale, 'areas');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

describe('content: en/es parity', () => {
  for (const name of JSON_ENTITIES) {
    it(`${name}.json has matching ids in en and es, same order`, () => {
      const en = loadJson('en', name);
      const es = loadJson('es', name);
      expect(es.map((e) => e.id)).toEqual(en.map((e) => e.id));
    });

    it(`${name}.json has no duplicate ids`, () => {
      const en = loadJson('en', name);
      const ids = en.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it(`${name}.json is non-empty`, () => {
      expect(loadJson('en', name).length).toBeGreaterThan(0);
    });
  }

  it('areas: en and es have the same filenames', () => {
    const en = areaFiles('en');
    const es = areaFiles('es');
    expect(en.length).toBe(6);
    expect(es).toEqual(en);
  });

  it.each(['en', 'es'] as const)(
    '%s: every area has valid frontmatter (title/formerCity/kind/order/pills)',
    (locale) => {
      const dir = join(CONTENT_DIR, locale, 'areas');
      const orders = new Set<number>();
      for (const file of areaFiles(locale)) {
        const raw = readFileSync(join(dir, file), 'utf8');
        const match = raw.match(/^---\n([\s\S]*?)\n---/);
        expect(match, `${file} is missing frontmatter`).toBeTruthy();
        const fm = match![1];
        expect(fm).toMatch(/title:/);
        expect(fm).toMatch(/formerCity:/);
        expect(fm).toMatch(/kind: (base|expansion)/);
        const orderMatch = fm.match(/order: (\d+)/);
        expect(orderMatch, `${file} is missing order`).toBeTruthy();
        const order = Number(orderMatch![1]);
        expect(orders.has(order), `${file} duplicates order ${order}`).toBe(false);
        orders.add(order);
      }
    },
  );

  it('pokedex: nationalNumber is unique per entry (no duplicate species)', () => {
    const en = loadJson<{ id: string; nationalNumber: number }>('en', 'pokedex');
    const numbers = en.map((e) => e.nationalNumber);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it.each(['en', 'es'] as const)(
    '%s: recipes.materials is structured {name, quantity>=1} — not a bare string',
    (locale) => {
      const recipes = loadJson<{ id: string; materials: { name: string; quantity: number }[] }>(
        locale,
        'recipes',
      );
      for (const r of recipes) {
        expect(r.materials.length).toBeGreaterThan(0);
        for (const m of r.materials) {
          expect(typeof m.name).toBe('string');
          expect(m.name.length).toBeGreaterThan(0);
          expect(Number.isInteger(m.quantity)).toBe(true);
          expect(m.quantity).toBeGreaterThanOrEqual(1);
        }
      }
    },
  );

  it.each(['en', 'es'] as const)(
    '%s: pokedex/collectibles x/y map pins are only set in pairs, both within 0-100',
    (locale) => {
      for (const name of ['pokedex', 'collectibles'] as const) {
        const entries = loadJson<{ id: string; x?: number; y?: number }>(locale, name);
        for (const e of entries) {
          expect(e.x === undefined).toBe(e.y === undefined);
          if (e.x !== undefined) {
            expect(e.x).toBeGreaterThanOrEqual(0);
            expect(e.x).toBeLessThanOrEqual(100);
          }
          if (e.y !== undefined) {
            expect(e.y).toBeGreaterThanOrEqual(0);
            expect(e.y).toBeLessThanOrEqual(100);
          }
        }
      }
    },
  );
});
