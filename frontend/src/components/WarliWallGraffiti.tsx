import React from 'react';

/**
 * Authentic Maharashtra Gramin Warli Folk Art & Wall Graffiti (वारली भित्तीचित्रे)
 * Renders traditional rural village graffiti (Tree of Life, Farmers Ploughing, Tarpa Dance, Grain Stalks, Sun & Village Huts)
 * as high-fidelity, responsive SVG motifs.
 */

export const WarliTreeOfLife: React.FC<{ className?: string; color?: string }> = ({
  className = "w-48 h-64",
  color = "currentColor"
}) => (
  <svg
    viewBox="0 0 200 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Trunk */}
    <path d="M100 240 L100 70 M92 240 L108 240 M96 230 L104 230" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
    {/* Roots */}
    <path d="M100 240 L85 255 M100 240 L115 255 M100 240 L100 258" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

    {/* Branches & Leaves (Warli geometric triangular foliage) */}
    {/* Tier 1 - Bottom Branches */}
    <path d="M100 190 Q70 170 45 180 M100 190 Q130 170 155 180" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polygon points="45,180 40,172 50,172" fill={color} />
    <polygon points="60,174 56,166 65,167" fill={color} />
    <polygon points="75,181 72,173 81,174" fill={color} />
    <polygon points="155,180 150,172 160,172" fill={color} />
    <polygon points="140,174 135,166 145,167" fill={color} />
    <polygon points="125,181 120,173 129,174" fill={color} />

    {/* Tier 2 - Middle Branches */}
    <path d="M100 150 Q60 130 35 140 M100 150 Q140 130 165 140" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polygon points="35,140 30,132 40,132" fill={color} />
    <polygon points="52,135 48,127 57,128" fill={color} />
    <polygon points="70,140 66,132 75,133" fill={color} />
    <polygon points="165,140 160,132 170,132" fill={color} />
    <polygon points="148,135 143,127 152,128" fill={color} />
    <polygon points="130,140 125,132 134,133" fill={color} />

    {/* Tier 3 - Upper Branches */}
    <path d="M100 110 Q70 85 50 95 M100 110 Q130 85 150 95" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polygon points="50,95 45,87 55,87" fill={color} />
    <polygon points="68,93 64,85 73,86" fill={color} />
    <polygon points="85,99 82,91 91,92" fill={color} />
    <polygon points="150,95 145,87 155,87" fill={color} />
    <polygon points="132,93 127,85 136,86" fill={color} />
    <polygon points="115,99 110,91 119,92" fill={color} />

    {/* Crown of Tree */}
    <path d="M100 70 L100 40 M100 70 L85 50 M100 70 L115 50" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <polygon points="100,38 93,28 107,28" fill={color} />
    <polygon points="85,48 78,38 92,39" fill={color} />
    <polygon points="115,48 108,39 122,38" fill={color} />

    {/* Warli Birds on branches */}
    {/* Bird Left */}
    <circle cx="58" cy="120" r="3" fill={color} />
    <path d="M58 120 Q65 118 70 123 Q63 125 58 123 Z" fill={color} />
    <path d="M55 120 L52 119" stroke={color} strokeWidth="1.2" />
    {/* Bird Right */}
    <circle cx="142" cy="120" r="3" fill={color} />
    <path d="M142 120 Q135 118 130 123 Q137 125 142 123 Z" fill={color} />
    <path d="M145 120 L148 119" stroke={color} strokeWidth="1.2" />

    {/* Small Warli deer / animal below tree */}
    <path d="M140 225 L160 225 M145 225 L142 238 M155 225 L158 238 M160 225 L166 215" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="167" cy="214" r="2.5" fill={color} />
    <path d="M166 212 L168 206 M168 212 L171 207" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const WarliFarmerWithBullocks: React.FC<{ className?: string; color?: string }> = ({
  className = "w-64 h-36",
  color = "currentColor"
}) => (
  <svg
    viewBox="0 0 280 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Ground baseline */}
    <path d="M10 130 L270 130" stroke={color} strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />

    {/* ================= BULLOCK 1 (Front/Right) ================= */}
    {/* Body: Two opposing triangles */}
    <polygon points="180,95 210,80 210,110" fill={color} />
    <polygon points="210,80 240,95 210,110" fill={color} />
    {/* Legs */}
    <path d="M190 105 L188 128 M198 105 L196 128 M225 105 L227 128 M235 105 L237 128" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Tail */}
    <path d="M180 95 Q174 105 175 118" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Neck and Head */}
    <path d="M240 95 L252 82" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="254" cy="80" r="4.5" fill={color} />
    {/* Horns */}
    <path d="M253 76 Q255 64 262 60 M255 76 Q259 65 267 63" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Muzzle */}
    <path d="M256 82 L260 84" stroke={color} strokeWidth="2" />

    {/* ================= BULLOCK 2 (Middle) ================= */}
    {/* Body */}
    <polygon points="120,95 150,80 150,110" fill={color} />
    <polygon points="150,80 180,95 150,110" fill={color} />
    {/* Legs */}
    <path d="M130 105 L128 128 M138 105 L136 128 M165 105 L167 128 M175 105 L177 128" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Tail */}
    <path d="M120 95 Q114 105 115 118" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Neck and Head */}
    <path d="M180 95 L192 82" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="194" cy="80" r="4.5" fill={color} />
    {/* Horns */}
    <path d="M193 76 Q195 64 202 60 M195 76 Q199 65 207 63" stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* Yoke (जोखड) connecting the bullocks */}
    <path d="M170 78 L240 78" stroke={color} strokeWidth="3" strokeLinecap="round" />

    {/* Plough Beam (नांगराचा इसाड) */}
    <path d="M65 112 L205 82" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Plough share (फाळ) into ground */}
    <path d="M65 112 L55 130" stroke={color} strokeWidth="4" strokeLinecap="round" />
    {/* Plough handle */}
    <path d="M65 112 L58 95" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

    {/* ================= FARMER (शेतकरी) ================= */}
    {/* Head */}
    <circle cx="48" cy="65" r="5" fill={color} />
    {/* Turban/Pagadi motif */}
    <path d="M45 62 Q48 57 52 61" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Torso: Two triangles joined at waist */}
    <polygon points="41,75 55,75 48,87" fill={color} />
    <polygon points="41,99 55,99 48,87" fill={color} />
    {/* Arms holding the plough handle and whip */}
    <path d="M44 76 L58 95 M52 76 Q65 65 75 58" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    {/* Whip / stick */}
    <path d="M75 58 Q95 48 105 52" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    {/* Legs */}
    <path d="M44 99 L38 128 M52 99 L50 128" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const WarliTarpaDance: React.FC<{ className?: string; color?: string }> = ({
  className = "w-60 h-40",
  color = "currentColor"
}) => (
  <svg
    viewBox="0 0 240 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Central Tarpa Musician */}
    <circle cx="120" cy="55" r="5" fill={color} />
    <polygon points="113,65 127,65 120,77" fill={color} />
    <polygon points="113,89 127,89 120,77" fill={color} />
    {/* Tarpa instrument (long flared horn) */}
    <path d="M120 60 Q135 60 155 50" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <polygon points="153,46 162,49 155,56" fill={color} />
    <path d="M116 89 L112 115 M124 89 L128 115" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

    {/* Dancing Villager 1 (Left) */}
    <circle cx="75" cy="58" r="4.5" fill={color} />
    <polygon points="69,67 81,67 75,78" fill={color} />
    <polygon points="69,89 81,89 75,78" fill={color} />
    <path d="M71 89 L64 112 M79 89 L83 112" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Linked arm to center */}
    <path d="M79 69 Q95 62 113 67" stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* Dancing Villager 2 (Far Left) */}
    <circle cx="35" cy="62" r="4.5" fill={color} />
    <polygon points="29,71 41,71 35,82" fill={color} />
    <polygon points="29,93 41,93 35,82" fill={color} />
    <path d="M31 93 L24 115 M39 93 L43 115" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Linked arm */}
    <path d="M39 73 Q55 65 69 69" stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* Dancing Villager 3 (Right) */}
    <circle cx="165" cy="58" r="4.5" fill={color} />
    <polygon points="159,67 171,67 165,78" fill={color} />
    <polygon points="159,89 171,89 165,78" fill={color} />
    <path d="M161 89 L155 112 M169 89 L174 112" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Linked arm from center */}
    <path d="M127 67 Q145 62 159 69" stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* Dancing Villager 4 (Far Right) */}
    <circle cx="205" cy="62" r="4.5" fill={color} />
    <polygon points="199,71 211,71 205,82" fill={color} />
    <polygon points="199,93 211,93 205,82" fill={color} />
    <path d="M201 93 L195 115 M209 93 L213 115" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Linked arm */}
    <path d="M171 69 Q188 65 199 73" stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* Circular rhythm dots / ground festivity */}
    <path d="M20 125 Q120 135 220 125" stroke={color} strokeWidth="1.5" strokeDasharray="4 6" />
  </svg>
);

export const WarliVillageHutAndSun: React.FC<{ className?: string; color?: string }> = ({
  className = "w-44 h-40",
  color = "currentColor"
}) => (
  <svg
    viewBox="0 0 180 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Radiant Sun (सूर्यदेव) */}
    <circle cx="140" cy="38" r="12" fill={color} />
    {/* Triangular Sun Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 140 + Math.cos(rad) * 16;
      const y1 = 38 + Math.sin(rad) * 16;
      const x2 = 140 + Math.cos(rad) * 23;
      const y2 = 38 + Math.sin(rad) * 23;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />;
    })}

    {/* Village Hut (कौलारू / झोपडी) */}
    {/* Roof (Triangular thatched roof with cross-hatching) */}
    <polygon points="15,95 65,45 115,95" fill="none" stroke={color} strokeWidth="3" />
    <line x1="65" y1="45" x2="65" y2="95" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="35" y1="75" x2="95" y2="75" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
    {/* Wall & Base */}
    <rect x="25" y="95" width="80" height="42" fill="none" stroke={color} strokeWidth="2.5" />
    {/* Door */}
    <rect x="52" y="105" width="24" height="32" fill={color} opacity="0.3" stroke={color} strokeWidth="2" />

    {/* Woman carrying water pot (घागर / हंडा) */}
    <circle cx="132" cy="98" r="4.5" fill={color} />
    {/* Water pot on head */}
    <ellipse cx="132" cy="90" rx="5" ry="3.5" fill={color} />
    <polygon points="126,106 138,106 132,117" fill={color} />
    <polygon points="126,128 138,128 132,117" fill={color} />
    {/* Arms holding the pot */}
    <path d="M127 107 Q123 98 128 92 M137 107 Q141 98 136 92" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    {/* Legs walking */}
    <path d="M129 128 L124 145 M135 128 L138 145" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const WarliGrainStalk: React.FC<{ className?: string; color?: string }> = ({
  className = "w-16 h-36",
  color = "currentColor"
}) => (
  <svg
    viewBox="0 0 70 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Stem */}
    <path d="M35 155 Q35 90 35 25" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Grain Sheaves (कणसाचे दाणे) */}
    {[35, 50, 65, 80, 95, 110, 125].map((y, idx) => (
      <g key={idx}>
        {/* Left grain */}
        <ellipse cx="23" cy={y} rx="9" ry="4.5" transform={`rotate(-25 23 ${y})`} fill={color} />
        <line x1="35" y1={y + 5} x2="14" y2={y - 4} stroke={color} strokeWidth="1.2" />
        {/* Right grain */}
        <ellipse cx="47" cy={y} rx="9" ry="4.5" transform={`rotate(25 47 ${y})`} fill={color} />
        <line x1="35" y1={y + 5} x2="56" y2={y - 4} stroke={color} strokeWidth="1.2" />
      </g>
    ))}
    {/* Top grain */}
    <ellipse cx="35" cy="20" rx="4.5" ry="9" fill={color} />
    <line x1="35" y1="20" x2="35" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Full Ambient Background Graffiti for Whole Screen
 * Non-intrusive, pointer-events-none watermark background overlay
 */
export const VillageGraffitiBackdrop: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-[0.06] text-stone-900 mix-blend-multiply"
      aria-hidden="true"
    >
      {/* Top Left: Warli Tree of Life */}
      <div className="absolute top-24 -left-10 lg:left-4 scale-90 lg:scale-100">
        <WarliTreeOfLife className="w-56 h-72" />
      </div>

      {/* Top Right: Sun, Hut & Water Bearer */}
      <div className="absolute top-28 -right-8 lg:right-6 scale-90 lg:scale-100">
        <WarliVillageHutAndSun className="w-52 h-44" />
      </div>

      {/* Mid Left: Grain Stalks */}
      <div className="absolute top-[42%] -left-4 lg:left-8">
        <WarliGrainStalk className="w-16 h-48" />
      </div>

      {/* Mid Right: Grain Stalks */}
      <div className="absolute top-[46%] -right-4 lg:right-8">
        <WarliGrainStalk className="w-16 h-48" />
      </div>

      {/* Lower Left: Farmer Ploughing with Bullocks */}
      <div className="absolute bottom-28 -left-12 lg:left-4 scale-80 lg:scale-100">
        <WarliFarmerWithBullocks className="w-72 h-40" />
      </div>

      {/* Lower Right: Village Tarpa Dance Celebration */}
      <div className="absolute bottom-24 -right-10 lg:right-4 scale-80 lg:scale-100">
        <WarliTarpaDance className="w-68 h-44" />
      </div>
    </div>
  );
};
