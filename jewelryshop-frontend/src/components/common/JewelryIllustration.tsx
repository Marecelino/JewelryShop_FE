import React from 'react'
import { Box } from '@mui/material'
import { brandColors } from '../../theme/palette'

interface Props {
  category?: string
  height?: number | string
  ratio?: string
}

export const JewelryIllustration: React.FC<Props> = ({ category = 'Rings', height = '100%', ratio = '4/5' }) => {
  const normCat = category.toLowerCase()

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: ratio,
        height,
        backgroundColor: '#F9F6F0',
        background: 'radial-gradient(circle at 50% 40%, #FCFAF7 0%, #F5F0E6 60%, #EDE4D4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${brandColors.border}`,
      }}
    >
      {/* Velvet Presentation Tray Glow & Concentric Ring */}
      <Box
        sx={{
          position: 'absolute',
          width: '75%',
          height: '75%',
          borderRadius: '50%',
          border: '1px solid rgba(176, 141, 87, 0.18)',
          boxShadow: 'inset 0 0 30px rgba(176, 141, 87, 0.08), 0 8px 24px rgba(47, 41, 37, 0.04)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 195, 165, 0.28) 0%, rgba(245, 240, 230, 0) 70%)',
        }}
      />

      {/* Haute Joaillerie Stylized Vector Art */}
      <svg
        width="112"
        height="112"
        viewBox="0 0 112 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 1, filter: 'drop-shadow(0 8px 16px rgba(47, 41, 37, 0.12))' }}
      >
        <defs>
          <linearGradient id="goldBand" x1="20" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EAD8B8" />
            <stop offset="40%" stopColor="#B08D57" />
            <stop offset="70%" stopColor="#DFCA9E" />
            <stop offset="100%" stopColor="#8C6A34" />
          </linearGradient>
          <linearGradient id="diamondFacet" x1="40" y1="15" x2="72" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#DCE5ED" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#B8CFE5" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="gemReflect" x1="40" y1="40" x2="72" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FAF8F5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B08D57" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {normCat.includes('ring') || normCat.includes('nhẫn') ? (
          // Solitaire Diamond Ring with Faceted Brilliant Crown
          <g>
            {/* Ring Shank (Band) */}
            <ellipse cx="56" cy="66" rx="28" ry="24" stroke="url(#goldBand)" strokeWidth="4.5" fill="none" />
            <ellipse cx="56" cy="66" rx="25" ry="21" stroke="#2F2925" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
            
            {/* Setting Prongs */}
            <path d="M47 38 L50 30" stroke="url(#goldBand)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M65 38 L62 30" stroke="url(#goldBand)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M56 39 L56 30" stroke="url(#goldBand)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Diamond Brilliant Cut Table and Crown */}
            <polygon points="46,30 66,30 73,20 39,20" fill="url(#diamondFacet)" stroke="#B08D57" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points="46,30 66,30 56,40" fill="rgba(255, 255, 255, 0.9)" stroke="#B08D57" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points="39,20 46,30 56,40" fill="url(#diamondFacet)" stroke="#B08D57" strokeWidth="1" />
            <polygon points="73,20 66,30 56,40" fill="url(#diamondFacet)" stroke="#B08D57" strokeWidth="1" />

            {/* Facet Lines */}
            <line x1="48" y1="20" x2="52" y2="30" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
            <line x1="64" y1="20" x2="60" y2="30" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />

            {/* Diamond Scintillation / Sparkle */}
            <circle cx="56" cy="19" r="1.5" fill="#FFFFFF" />
            <line x1="56" y1="13" x2="56" y2="17" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="62" y1="15" x2="59" y2="18" stroke="#B08D57" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="50" y1="15" x2="53" y2="18" stroke="#B08D57" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        ) : normCat.includes('neck') || normCat.includes('dây') ? (
          // Royal Teardrop Gem Necklace
          <g>
            {/* Delicate Chain Swags */}
            <path d="M26 26 C36 62, 76 62, 86 26" stroke="url(#goldBand)" strokeWidth="2" strokeDasharray="3 2" fill="none" />
            <path d="M30 24 C40 55, 72 55, 82 24" stroke="#D8C3A5" strokeWidth="1" fill="none" opacity="0.6" />

            {/* Bale connector */}
            <rect x="53.5" y="55" width="5" height="7" rx="1.5" fill="url(#goldBand)" stroke="#8C6A34" strokeWidth="0.8" />

            {/* Teardrop Gemstone & Outer Halo */}
            <path
              d="M56 62 C48 72, 44 80, 44 87 C44 95, 49 100, 56 100 C63 100, 68 95, 68 87 C68 80, 64 72, 56 62 Z"
              fill="url(#diamondFacet)"
              stroke="url(#goldBand)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Inner Facet Lines */}
            <path d="M56 67 L56 97" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />
            <line x1="47" y1="84" x2="65" y2="84" stroke="rgba(176, 141, 87, 0.4)" strokeWidth="1" />
            <circle cx="56" cy="84" r="3" fill="#B08D57" />
          </g>
        ) : normCat.includes('ear') || normCat.includes('bông') || normCat.includes('tai') ? (
          // Chandelier Gem Earrings
          <g>
            {/* Left Earring */}
            <circle cx="42" cy="28" r="4.5" fill="url(#goldBand)" stroke="#8C6A34" strokeWidth="1" />
            <circle cx="42" cy="28" r="2" fill="#FFFFFF" />
            <line x1="42" y1="33" x2="42" y2="48" stroke="url(#goldBand)" strokeWidth="2" strokeDasharray="2 1.5" />
            <polygon points="42,48 49,64 35,64" fill="url(#diamondFacet)" stroke="url(#goldBand)" strokeWidth="1.8" />
            <circle cx="42" cy="72" r="3" fill="url(#goldBand)" />

            {/* Right Earring */}
            <circle cx="70" cy="28" r="4.5" fill="url(#goldBand)" stroke="#8C6A34" strokeWidth="1" />
            <circle cx="70" cy="28" r="2" fill="#FFFFFF" />
            <line x1="70" y1="33" x2="70" y2="48" stroke="url(#goldBand)" strokeWidth="2" strokeDasharray="2 1.5" />
            <polygon points="70,48 77,64 63,64" fill="url(#diamondFacet)" stroke="url(#goldBand)" strokeWidth="1.8" />
            <circle cx="70" cy="72" r="3" fill="url(#goldBand)" />
          </g>
        ) : normCat.includes('brace') || normCat.includes('vòng') || normCat.includes('lắc') ? (
          // Luxury Bangle / Tennis Bracelet
          <g>
            <ellipse cx="56" cy="56" rx="36" ry="24" stroke="url(#goldBand)" strokeWidth="5" transform="rotate(-18 56 56)" fill="none" />
            <ellipse cx="56" cy="56" rx="34" ry="22" stroke="#FAF8F5" strokeWidth="1" strokeDasharray="2 4" transform="rotate(-18 56 56)" fill="none" />
            
            {/* Diamond Highlights around the Bangle */}
            <circle cx="78" cy="40" r="3.5" fill="#FFFFFF" stroke="#B08D57" strokeWidth="1" />
            <circle cx="34" cy="72" r="3.5" fill="#FFFFFF" stroke="#B08D57" strokeWidth="1" />
            <circle cx="64" cy="76" r="3" fill="url(#goldBand)" />
            <circle cx="48" cy="36" r="3" fill="url(#goldBand)" />
          </g>
        ) : (
          // Emerald Cut Masterpiece Gemstone / Pendant
          <g>
            {/* Outer Emerald Setting */}
            <rect x="36" y="24" width="40" height="64" rx="6" fill="url(#gemReflect)" stroke="url(#goldBand)" strokeWidth="2.5" />
            
            {/* Step-Cut Facets */}
            <rect x="42" y="32" width="28" height="48" rx="4" fill="url(#diamondFacet)" stroke="#B08D57" strokeWidth="1.5" />
            <line x1="36" y1="24" x2="42" y2="32" stroke="#B08D57" strokeWidth="1.5" />
            <line x1="76" y1="24" x2="70" y2="32" stroke="#B08D57" strokeWidth="1.5" />
            <line x1="36" y1="88" x2="42" y2="80" stroke="#B08D57" strokeWidth="1.5" />
            <line x1="76" y1="88" x2="70" y2="80" stroke="#B08D57" strokeWidth="1.5" />

            {/* Center Table */}
            <rect x="46" y="38" width="20" height="36" rx="2" fill="rgba(255,255,255,0.7)" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="56" cy="56" r="2.5" fill="#B08D57" />
          </g>
        )}
      </svg>
    </Box>
  )
}
