// ============================================================
//  js/icons.js
//  Bibliothèque d'icônes SVG inline — style stroke unifié
//  (inspiré Lucide/Feather : stroke 2px, arrondis, 24x24 viewBox)
//  Remplace les emojis utilisés comme logos/icônes dans tout le site.
// ============================================================

const ICONS = {
  // ── Identité / navigation ─────────────────────────────────
  logo: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 11L16 5L28 11L16 17L4 11Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M9 14.5V21C9 21 12 24 16 24C20 24 23 21 23 21V14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28 11V18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  menu: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  fermer: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  chevronDroite: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  // ── Modules principaux ────────────────────────────────────
  document: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 13h6M9 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  paiement: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M2 10h20" stroke="currentColor" stroke-width="2"/></svg>`,

  parametres: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  cadenas: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" stroke-width="2"/></svg>`,

  graphique: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3v18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 15l4-5 3 3 5-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  utilisateurs: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  cloche: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  video: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 7l-7 5 7 5V7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" stroke-width="2"/></svg>`,

  quiz: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  institution: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21h18M4 21V9l8-6 8 6v12M9 21v-6h6v6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 9h.01M12 9h.01M15 9h.01M9 13h.01M15 13h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,

  telechargement: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  robot: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="9" width="16" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M12 9V5m0 0a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" stroke-width="2"/><path d="M8 13v2M16 13v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M2 12v4M22 12v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  etoile: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.9 6.6L22 9.3l-5.2 4.9 1.4 7.1L12 17.8l-6.2 3.5 1.4-7.1L2 9.3l7.1-.7L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,

  panier: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h2l2.68 13.39A2 2 0 009.64 18H19a2 2 0 002-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="21" r="1.5" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="21" r="1.5" stroke="currentColor" stroke-width="1.8"/></svg>`,

  coche: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  trophee: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 5H4a2 2 0 002 4M17 5h3a2 2 0 01-2 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  fusee: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c3 2 5 6 5 10 0 2-1 4-1 4H8s-1-2-1-4c0-4 2-8 5-10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="1.6" stroke="currentColor" stroke-width="1.6"/><path d="M8 16l-3 5M16 16l3 5M10 20h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  copier: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/></svg>`,

  telephone: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .7 3a2 2 0 01-.5 2.1L8 10.1a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c1 .4 2 .6 3 .7a2 2 0 011.7 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,

  email: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M2 7l10 6 10-6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,

  attention: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L1 21h22L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v5M12 17.5v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  vagues: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6c1.5 2 3.5 2 5 0s3.5-2 5 0 3.5 2 5 0 3.5-2 5 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M2 12c1.5 2 3.5 2 5 0s3.5-2 5 0 3.5 2 5 0 3.5-2 5 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M2 18c1.5 2 3.5 2 5 0s3.5-2 5 0 3.5 2 5 0 3.5-2 5 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,

  cercleOrange: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  monde: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z" stroke="currentColor" stroke-width="2"/></svg>`,

  horloge: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  // ── Réseaux sociaux ────────────────────────────────────────
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.3.1.8-.1 1.5z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.5 6.2a2.8 2.8 0 00-2-2C18.9 3.7 12 3.7 12 3.7s-6.9 0-8.5.5a2.8 2.8 0 00-2 2A29 29 0 001 12a29 29 0 00.5 5.8 2.8 2.8 0 002 2c1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5a2.8 2.8 0 002-2 29 29 0 00.5-5.8 29 29 0 00-.5-5.8zM9.8 15.5V8.5l6 3.5-6 3.5z"/></svg>`,

  // ── Icônes complémentaires (couverture emojis du site) ────
  liste: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  croixCercle: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  batiment: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 22V4a1 1 0 011-1h10a1 1 0 011 1v18M6 22h12M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  portefeuille: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5h-5a2 2 0 010-4h5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  actualiser: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 2v6h-6M3 22v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11a9 9 0 0115-6.7L21 8M21 13a9 9 0 01-15 6.7L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  poucehaut: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 22V11M2 13v7a2 2 0 002 2h12.9a2 2 0 002-1.7l1.4-8a2 2 0 00-2-2.3H14l1-4.4a2 2 0 00-2-2.6L11 8l-4 5H2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  croix: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  coeur: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.5l-1-.9a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  aide: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 2-3 4M12 17.5v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  poubelle: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  drapeau: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 22V4M4 4l16 3-16 3" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  fete: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.8 11.3L2 22l10.7-3.8M4 15l5 5M15 3l1.5 3.5L20 8l-3.5 1.5L15 13l-1.5-3.5L10 8l3.5-1.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  regle: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 16.5L16.5 3a1 1 0 011.4 0l3.1 3.1a1 1 0 010 1.4L7.5 21H3v-4.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M13.5 6.5l2 2M10.5 9.5l2 2M7.5 12.5l2 2" stroke="currentColor" stroke-width="2"/></svg>`,
  microscope: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h8M9 18v-4.5a3.5 3.5 0 117 0V15M14 10.5V6a2 2 0 00-2-2h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 22h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  cle: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7.5" cy="15.5" r="5.5" stroke="currentColor" stroke-width="2"/><path d="M11 12l9-9M17 9l3 3M14 6l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  enveloppeFermee: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M2 7l10 6 10-6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 17l7-6M22 17l-7-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  oeil: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>`,
  livre: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  loupe: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  cle_outil: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.3a4 4 0 00-5.4 5.4L2 19v3h3l7.3-7.3a4 4 0 005.4-5.4l-2.8 2.8-2.5-.6-.6-2.5 2.9-2.8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  disquette: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  crayon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  boussole: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  diplome: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 8l10 5 8-4.1V17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 10.5V16c0 1.1 2.7 3 6 3s6-1.9 6-3v-5.5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
};

/**
 * Injecte une icône SVG dans un élément avec une taille et couleur données.
 * Usage : icone("document", 24, "var(--vert)")
 */
function icone(nom, taille = 24, couleur = "currentColor") {
  const svg = ICONS[nom] || ICONS.coche;
  return `<span style="display:inline-flex;width:${taille}px;height:${taille}px;color:${couleur};" aria-hidden="true">${svg}</span>`;
}

// Remplace automatiquement tout élément portant data-icone="nom" au chargement
function initIcones(racine = document) {
  racine.querySelectorAll("[data-icone]").forEach((el) => {
    const nom = el.getAttribute("data-icone");
    const taille = el.getAttribute("data-taille") || 24;
    const couleur = el.getAttribute("data-couleur") || "currentColor";
    if (ICONS[nom]) {
      el.innerHTML = ICONS[nom];
      el.style.display = "inline-flex";
      el.style.width = `${taille}px`;
      el.style.height = `${taille}px`;
      el.style.color = couleur;
      el.setAttribute("aria-hidden", "true");
    }
  });
}

// Surveille en continu le DOM pour transformer aussi les icônes insérées
// dynamiquement après coup (innerHTML généré par du JS, boutons de chargement, etc.)
function surveillerNouvellesIcones() {
  if (typeof MutationObserver === "undefined") return;

  const observateur = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const noeud of mutation.addedNodes) {
        if (noeud.nodeType !== 1) continue; // ignore les nœuds texte
        if (noeud.hasAttribute?.("data-icone")) {
          initIcones(noeud.parentElement || document);
        } else if (noeud.querySelector?.("[data-icone]")) {
          initIcones(noeud);
        }
      }
    }
  });

  observateur.observe(document.body, { childList: true, subtree: true });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initIcones();
    surveillerNouvellesIcones();
  });
}

window.ICONS = ICONS;
window.icone = icone;
