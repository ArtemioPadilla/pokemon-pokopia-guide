import { withBase } from '@/lib/href';

/**
 * Area map backgrounds. Session 3 switched from all-hand-drawn schematics to
 * REAL in-game imagery wherever a genuine, usable source asset exists — the
 * site owner explicitly accepted the copyright tradeoff of hosting real game
 * imagery over hand-drawn SVG placeholders (see CLAUDE.md's "Coverage TODO"
 * for the sourcing/licensing notes on each file in `public/area-maps/`):
 *
 * - **Rocky Ridges** and **Sparkling Skylands** use the actual in-game
 *   overworld map screenshot from each area's Bulbapedia location infobox
 *   (`File:Rocky_Ridges_map_Pokopia.png` / `File:Sparkling_Skylands_Map_Pokopia.png`)
 *   — a genuine top-down layout, so pins placed against it are geographically
 *   honest, not guessed.
 * - **Palette Town** and **Bubbly Basin** use a real Serebii.net gameplay
 *   screenshot of the area. Neither has an in-game overview map available
 *   anywhere this guide could find, and neither area has any sourced,
 *   pinnable Pokédex/Collectibles entry yet — so the screenshot is
 *   decorative scene-setting only, not a claim about where anything is.
 * - **Withered Wasteland** and **Bleak Beach** keep the earlier hand-drawn
 *   SVG schematic. Both have real, sourced pins (Pokédex and/or
 *   Collectibles entries with precise habitat text), but no real top-down
 *   overview map or wide establishing shot of the *whole* area turned up in
 *   sourcing — only narrow, UI-cluttered gameplay screenshots centered on
 *   the player character, one small slice of the area at a time. Swapping
 *   those in behind multiple pins at different in-world spots would be
 *   *less* honest than the schematic, not more, since a single narrow shot
 *   can't actually show where those spots are relative to each other. Every
 *   shape still uses this site's own design tokens (`var(--primary)`,
 *   `var(--chart-2)`, etc. from `src/styles/global.css`) so it stays
 *   theme-aware for free.
 *
 * Decorative only — always rendered inside an `aria-hidden="true"` <svg> by
 * AreaMap. Anything without a mapped key (see areaMapKey.ts) renders the
 * generic `default` case rather than a fabricated illustration of a place
 * this guide hasn't verified any detail about.
 */
export default function AreaMapBackground({ areaKey }: { areaKey: string }) {
  switch (areaKey) {
    case 'withered-wasteland':
      return <WitheredWasteland />;
    case 'bleak-beach':
      return <BleakBeach />;
    case 'rocky-ridges':
      return <RealImage file="rocky-ridges.webp" />;
    case 'sparkling-skylands':
      return <RealImage file="sparkling-skylands.webp" />;
    case 'palette-town':
      return <RealImage file="palette-town.webp" />;
    case 'bubbly-basin':
      return <RealImage file="bubbly-basin.webp" />;
    default:
      return <Unknown />;
  }
}

/**
 * A real, sourced raster image stretched to fill the map's 0–100 viewBox —
 * `preserveAspectRatio="none"` matches how the hand-drawn schematics below
 * already fill the same box, so both kinds of background behave identically
 * inside AreaMap's fixed-aspect-ratio container.
 */
function RealImage({ file }: { file: string }) {
  return (
    <image
      href={withBase(`/area-maps/${file}`)}
      x="0"
      y="0"
      width="100"
      height="100"
      preserveAspectRatio="none"
    />
  );
}

function WitheredWasteland() {
  return (
    <>
      <rect x="0" y="0" width="100" height="100" fill="var(--muted)" />
      {/* Worn path leading to the Pokémon Center — a filled dirt trail, not a
          floating stroked line, so it reads as ground rather than a stick */}
      <path
        d="M44 100 C 42 82, 46 66, 47 58 L53 58 C 54 66, 58 82, 56 100 Z"
        fill="var(--border)"
        opacity="0.4"
      />
      {/* Drought cracks radiating from the path, across the open ground */}
      <g stroke="var(--border)" strokeWidth="0.6" fill="none" opacity="0.7">
        <path d="M40 90 L30 84 L34 74 L24 68" />
        <path d="M60 88 L70 82 L66 72 L76 66" />
        <path d="M42 70 L34 64" />
        <path d="M58 68 L66 62" />
        <path d="M12 30 L20 36 L16 46" />
        <path d="M88 26 L80 32 L84 42" />
      </g>
      {/* Boulder + Tall Grass cluster, tucked directly beside the Center so
          it reads as one plaza instead of a stray patch up in empty space */}
      <g fill="var(--muted-foreground)" opacity="0.55">
        <circle cx="30" cy="52" r="5.5" />
        <circle cx="23" cy="56" r="3.6" />
      </g>
      <g fill="var(--primary)" opacity="0.65">
        <ellipse cx="27" cy="61" rx="7.5" ry="3.4" />
        <ellipse cx="34" cy="59" rx="4.5" ry="2.2" />
      </g>
      {/* Exercise Resting Spot: bench + punching bag, mirrored on the other
          side of the Center at the same ground level */}
      <g>
        <ellipse cx="72" cy="62" rx="10" ry="3.2" fill="var(--border)" opacity="0.3" />
        <rect x="66" y="58" width="10" height="2.6" rx="1" fill="var(--secondary)" />
        <circle cx="73" cy="51" r="3.6" fill="var(--accent)" />
        <line x1="73" y1="47.4" x2="73" y2="58" stroke="var(--border)" strokeWidth="0.8" />
      </g>
      {/* Pretty Flower Bed, at the foot of the path where it opens onto the
          plaza — no longer stranded off in an empty corner */}
      <g fill="var(--accent)" opacity="0.8">
        <circle cx="38" cy="78" r="2.4" />
        <circle cx="43" cy="82" r="2" />
        <circle cx="36" cy="83" r="1.7" />
      </g>
      {/* The broken-down Pokémon Center, centered where the path arrives */}
      <g>
        <ellipse cx="50" cy="59" rx="17" ry="3" fill="var(--border)" opacity="0.3" />
        <rect
          x="41"
          y="45"
          width="18"
          height="13"
          rx="1.2"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="0.7"
        />
        <path d="M39 45 L50 37 L61 45 Z" fill="var(--destructive)" opacity="0.8" />
        <rect x="48" y="51" width="4" height="7" fill="var(--border)" opacity="0.7" />
      </g>
    </>
  );
}

function BleakBeach() {
  return (
    <>
      {/* Sky, sea, and sand as three clean horizontal bands so the scene
          reads as a coastline at a glance, not a stack of loose shapes */}
      <rect x="0" y="0" width="100" height="48" fill="var(--secondary)" />
      <rect x="0" y="48" width="100" height="24" fill="var(--chart-2)" opacity="0.35" />
      <rect x="0" y="72" width="100" height="28" fill="var(--accent)" opacity="0.55" />
      {/* Dim, light-starved sea, waves sitting inside the sea band */}
      <g stroke="var(--chart-2)" strokeWidth="0.8" fill="none" opacity="0.7">
        <path d="M0 56 Q 12 51, 24 56 T 48 56 T 72 56 T 100 56" />
        <path d="M0 64 Q 12 59, 24 64 T 48 64 T 72 64 T 100 64" />
      </g>
      {/* Cliffside overlook, rooted at the shoreline on the left */}
      <path
        d="M2 72 L10 72 L22 30 L14 30 Z"
        fill="var(--muted-foreground)"
        opacity="0.55"
      />
      {/* Beach hut, sitting on the sand */}
      <g>
        <rect
          x="24"
          y="78"
          width="11"
          height="9"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="0.6"
        />
        <path d="M23 78 L29.5 71 L36 78 Z" fill="var(--pill-craft)" opacity="0.75" />
      </g>
      {/* Pier: a single tapering walkway from the sand out over the water,
          not two crossed lines that read as an X instead of a structure */}
      <path d="M58 82 L64 82 L88 54 L86 54 Z" fill="var(--border)" opacity="0.6" />
      <g stroke="var(--border)" strokeWidth="0.5" opacity="0.5">
        <line x1="60" y1="79" x2="63" y2="79" />
        <line x1="68" y1="73" x2="71" y2="73" />
        <line x1="76" y1="66" x2="79" y2="66" />
      </g>
    </>
  );
}

function Unknown() {
  return (
    <>
      <rect x="0" y="0" width="100" height="100" fill="var(--muted)" />
      <g stroke="var(--border)" strokeWidth="0.6" strokeDasharray="2 2" fill="none" opacity="0.6">
        <rect x="8" y="8" width="84" height="84" rx="4" />
      </g>
    </>
  );
}
