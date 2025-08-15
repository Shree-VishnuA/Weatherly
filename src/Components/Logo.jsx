function Logo() {
  return (
    <div className="z-10 w-50">
      <svg viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle cx="30" cy="30" r="25" fill="#1E3A8A" opacity="0.15" />

        {/* Sun rays */}
        <g stroke="#CC7A00" strokeWidth="2" strokeLinecap="round">
          <line x1="30" y1="8" x2="30" y2="12" />
          <line x1="30" y1="48" x2="30" y2="52" />
          <line x1="8" y1="30" x2="12" y2="30" />
          <line x1="48" y1="30" x2="52" y2="30" />
          <line x1="15.76" y1="15.76" x2="18.54" y2="18.54" />
          <line x1="41.46" y1="41.46" x2="44.24" y2="44.24" />
          <line x1="44.24" y1="15.76" x2="41.46" y2="18.54" />
          <line x1="18.54" y1="41.46" x2="15.76" y2="44.24" />
        </g>

        {/* Sun */}
        <circle cx="30" cy="25" r="8" fill="#CC7A00" />

        {/* Cloud */}
        <path
          d="M20 35 C15 35, 15 40, 20 40 L40 40 C45 40, 45 35, 40 35 C40 32, 37 30, 35 30 C33 28, 30 28, 28 30 C25 30, 22 32, 22 35 Z"
          fill="#2563EB"
        />

        {/* Raindrops */}
        <g fill="#1E3A8A" opacity="0.8">
          <ellipse cx="25" cy="45" rx="1" ry="2" />
          <ellipse cx="30" cy="47" rx="1" ry="2" />
          <ellipse cx="35" cy="45" rx="1" ry="2" />
        </g>

        {/* Text */}
        <text
          x="70"
          y="40"
          fontFamily="Arial, sans-serif"
          fontSize="28"
          fontWeight="600"
          fill="#1E3A8A"
        >
          Weatherly
        </text>

        {/* Underline */}
        <rect
          x="70"
          y="45"
          width="130"
          height="2"
          fill="#1E3A8A"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export default Logo;
