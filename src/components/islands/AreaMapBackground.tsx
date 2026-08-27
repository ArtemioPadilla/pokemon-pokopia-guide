/**
 * Hand-authored, stylized/schematic SVG backgrounds for the area maps — NOT
 * game screenshots (none exist as source assets for this guide, and reusing
 * real capture art would be a copyright risk anyway). Every shape uses this
 * site's own design tokens (`var(--primary)`, `var(--chart-2)`, etc. from
 * `src/styles/global.css`) so the maps stay theme-aware for free and never
 * introduce a color the rest of the site doesn't already use. Decorative
 * only — always rendered inside an `aria-hidden="true"` <svg> by AreaMap.
 *
 * Only areas with at least one sourced, placeable Pokédex/Collectibles entry
 * get bespoke art (see areaMapKey.ts); anything else renders the generic
 * `default` case rather than a fabricated illustration of a place this guide
 * hasn't verified any detail about.
 */
export default function AreaMapBackground({ areaKey }: { areaKey: string }) {
  switch (areaKey) {
    case 'withered-wasteland':
      return <WitheredWasteland />;
    case 'bleak-beach':
      return <BleakBeach />;
    case 'rocky-ridges':
      return <RockyRidges />;
    default:
      return <Unknown />;
  }
}

function WitheredWasteland() {
  return (
    <>
      <rect x="0" y="0" width="100" height="100" fill="var(--muted)" />
      {/* Drought cracks across the ground */}
      <g stroke="var(--border)" strokeWidth="0.6" fill="none" opacity="0.8">
        <path d="M5 15 L14 22 L10 33 L20 38" />
        <path d="M85 10 L78 20 L88 28" />
        <path d="M8 80 L18 74 L15 62 L26 58" />
        <path d="M92 85 L82 78 L90 68" />
        <path d="M40 90 L48 82 L42 74" />
      </g>
      {/* Worn path leading to the Pokémon Center */}
      <path
        d="M50 100 C 48 85, 52 70, 50 58"
        stroke="var(--border)"
        strokeWidth="4"
        fill="none"
        opacity="0.55"
      />
      {/* Boulders behind the Center, shading Timburr's Tall Grass */}
      <g fill="var(--muted-foreground)" opacity="0.55">
        <circle cx="53" cy="20" r="5.5" />
        <circle cx="61" cy="17" r="4" />
      </g>
      <g fill="var(--primary)" opacity="0.6">
        <ellipse cx="58" cy="27" rx="7" ry="3.2" />
        <ellipse cx="52" cy="30" rx="4" ry="2" />
      </g>
      {/* Exercise Resting Spot: bench + punching bag */}
      <g>
        <rect x="68" y="31" width="9" height="2.4" rx="1" fill="var(--secondary)" />
        <circle cx="74" cy="24" r="3.4" fill="var(--accent)" />
        <line x1="74" y1="20.6" x2="74" y2="17" stroke="var(--border)" strokeWidth="0.8" />
      </g>
      {/* Pretty Flower Bed near the starting point */}
      <g fill="var(--accent)" opacity="0.75">
        <circle cx="30" cy="55" r="2.2" />
        <circle cx="34" cy="59" r="2" />
        <circle cx="29" cy="61" r="1.6" />
      </g>
      {/* The broken-down Pokémon Center */}
      <g>
        <rect
          x="41"
          y="49"
          width="18"
          height="13"
          rx="1.2"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="0.7"
        />
        <path d="M39 49 L50 41 L61 49 Z" fill="var(--destructive)" opacity="0.75" />
        <rect x="48" y="55" width="4" height="7" fill="var(--border)" opacity="0.7" />
      </g>
    </>
  );
}

function BleakBeach() {
  return (
    <>
      <rect x="0" y="0" width="100" height="60" fill="var(--secondary)" />
      <rect x="0" y="60" width="100" height="40" fill="var(--accent)" opacity="0.55" />
      {/* Dim, light-starved sea */}
      <g stroke="var(--chart-2)" strokeWidth="0.8" fill="none" opacity="0.6">
        <path d="M0 45 Q 12 40, 24 45 T 48 45 T 72 45 T 100 45" />
        <path d="M0 53 Q 12 48, 24 53 T 48 53 T 72 53 T 100 53" />
      </g>
      {/* Cliffside overlook */}
      <g fill="var(--muted-foreground)" opacity="0.6">
        <path d="M38 38 L54 22 L62 38 Z" />
      </g>
      {/* Beach huts */}
      <g>
        <rect
          x="18"
          y="66"
          width="10"
          height="8"
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="0.6"
        />
        <path d="M17 66 L23 60 L29 66 Z" fill="var(--pill-craft)" opacity="0.7" />
      </g>
      {/* Pier reaching into the water */}
      <g stroke="var(--border)" strokeWidth="1.6" opacity="0.7">
        <line x1="65" y1="58" x2="85" y2="50" />
        <line x1="70" y1="61" x2="90" y2="53" />
      </g>
    </>
  );
}

function RockyRidges() {
  return (
    <>
      <rect x="0" y="0" width="100" height="100" fill="var(--muted)" />
      {/* Ash haze */}
      <g fill="var(--muted-foreground)" opacity="0.25">
        <ellipse cx="25" cy="14" rx="18" ry="6" />
        <ellipse cx="70" cy="10" rx="16" ry="5" />
      </g>
      {/* Layered ridge silhouettes */}
      <path
        d="M0 55 L20 32 L34 46 L50 20 L68 44 L84 28 L100 50 L100 100 L0 100 Z"
        fill="var(--muted-foreground)"
        opacity="0.35"
      />
      <path
        d="M0 68 L18 52 L36 64 L58 46 L78 62 L100 50 L100 100 L0 100 Z"
        fill="var(--muted-foreground)"
        opacity="0.5"
      />
      {/* Artificial hot spring */}
      <g>
        <circle cx="60" cy="60" r="9" fill="var(--chart-2)" opacity="0.65" />
        <circle cx="60" cy="60" r="9" fill="none" stroke="var(--border)" strokeWidth="0.6" />
        <path
          d="M56 49 q 2 -4 0 -7 M64 49 q 2 -4 0 -7"
          stroke="var(--muted-foreground)"
          strokeWidth="0.7"
          fill="none"
          opacity="0.6"
        />
      </g>
      {/* Mountain path */}
      <path
        d="M30 100 C 28 85, 34 70, 30 55"
        stroke="var(--border)"
        strokeWidth="3.2"
        fill="none"
        opacity="0.5"
      />
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
