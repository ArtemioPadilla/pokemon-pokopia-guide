import { describe, expect, it } from 'vitest';
import { typeBadgeClass } from './pokemonTypes';

describe('typeBadgeClass', () => {
  it('maps every English type name to its own distinct class', () => {
    const english = [
      'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison',
      'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
    ];
    const classes = english.map(typeBadgeClass);
    expect(new Set(classes).size).toBe(english.length);
    for (const cls of classes) expect(cls).not.toContain('text-muted-foreground');
  });

  it('maps every Spanish type name to the same class as its English equivalent', () => {
    const pairs: Array<[string, string]> = [
      ['Fuego', 'Fire'], ['Agua', 'Water'], ['Eléctrico', 'Electric'], ['Planta', 'Grass'],
      ['Hielo', 'Ice'], ['Lucha', 'Fighting'], ['Veneno', 'Poison'], ['Tierra', 'Ground'],
      ['Volador', 'Flying'], ['Psíquico', 'Psychic'], ['Bicho', 'Bug'], ['Roca', 'Rock'],
      ['Fantasma', 'Ghost'], ['Dragón', 'Dragon'], ['Siniestro', 'Dark'], ['Acero', 'Steel'],
      ['Hada', 'Fairy'],
    ];
    for (const [es, en] of pairs) {
      expect(typeBadgeClass(es)).toBe(typeBadgeClass(en));
    }
  });

  it('is case-insensitive', () => {
    expect(typeBadgeClass('fire')).toBe(typeBadgeClass('Fire'));
    expect(typeBadgeClass('FIRE')).toBe(typeBadgeClass('Fire'));
  });

  it('falls back to a neutral class for an unrecognized type name', () => {
    expect(typeBadgeClass('Cosmic')).toContain('text-muted-foreground');
  });
});
