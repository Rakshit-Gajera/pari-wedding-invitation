const line = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
};

export const PinIcon = () => (
  <svg {...line}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);

export const CalendarIcon = () => (
  <svg {...line}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8 3v4M16 3v4M9 15h6" />
  </svg>
);

export const CopyIcon = () => (
  <svg {...line}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);

export const TickIcon = () => (
  <svg {...line}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const CallIcon = () => (
  <svg {...line}>
    <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3Z" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg {...line}>
    <path d="M4 20l1.4-4.2A8 8 0 1 1 8.4 18.7L4 20Z" />
    <path d="M9 9.2c0 3 2.8 5.8 5.8 5.8l1-1.5-2-1-1 .7c-.9-.5-1.5-1.1-2-2l.7-1-1-2L9 9.2Z" />
  </svg>
);
