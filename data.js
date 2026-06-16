// =============================================================
// DATA.JS – WM Tippspiel EA-515
// Offizieller Spielplan WM 2026 (Auslosung 5. Dez. 2025)
// Alle Zeiten in Deutscher Zeit (CEST = UTC+2)
// =============================================================

const PARTICIPANTS = [
  'Gruener', 'Aicher', 'Cakar', 'Weiland', 'Binner', 'Barth',
  'Gerhartz', 'Fingerhut', 'Kramschuster', 'Bieringer', 'Kessens',
  'Sorg', 'Babic', 'Degener', 'Drescher', 'Fuchs', 'Knapf',
  'Scharnagl', 'Rickhoff',
];

const TEAM_FLAGS = {
  'Mexico': '🇲🇽', 'Südafrika': '🇿🇦', 'Südkorea': '🇰🇷', 'Tschechien': '🇨🇿',
  'Kanada': '🇨🇦', 'Bosnien-Herzegowina': '🇧🇦', 'Katar': '🇶🇦', 'Schweiz': '🇨🇭',
  'Brasilien': '🇧🇷', 'Marokko': '🇲🇦', 'Haiti': '🇭🇹', 'Schottland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA': '🇺🇸', 'Paraguay': '🇵🇾', 'Australien': '🇦🇺', 'Türkei': '🇹🇷',
  'Deutschland': '🇩🇪', 'Curaçao': '🇨🇼', 'Elfenbeinküste': '🇨🇮', 'Ecuador': '🇪🇨',
  'Niederlande': '🇳🇱', 'Japan': '🇯🇵', 'Schweden': '🇸🇪', 'Tunesien': '🇹🇳',
  'Belgien': '🇧🇪', 'Ägypten': '🇪🇬', 'Iran': '🇮🇷', 'Neuseeland': '🇳🇿',
  'Spanien': '🇪🇸', 'Kap Verde': '🇨🇻', 'Saudi-Arabien': '🇸🇦', 'Uruguay': '🇺🇾',
  'Frankreich': '🇫🇷', 'Senegal': '🇸🇳', 'Irak': '🇮🇶', 'Norwegen': '🇳🇴',
  'Argentinien': '🇦🇷', 'Algerien': '🇩🇿', 'Österreich': '🇦🇹', 'Jordanien': '🇯🇴',
  'Portugal': '🇵🇹', 'DR Kongo': '🇨🇩', 'Usbekistan': '🇺🇿', 'Kolumbien': '🇨🇴',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Kroatien': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦',
};

const GROUPS = {
  A: ['Mexico', 'Südafrika', 'Südkorea', 'Tschechien'],
  B: ['Kanada', 'Bosnien-Herzegowina', 'Katar', 'Schweiz'],
  C: ['Brasilien', 'Marokko', 'Haiti', 'Schottland'],
  D: ['USA', 'Paraguay', 'Australien', 'Türkei'],
  E: ['Deutschland', 'Curaçao', 'Elfenbeinküste', 'Ecuador'],
  F: ['Niederlande', 'Japan', 'Schweden', 'Tunesien'],
  G: ['Belgien', 'Ägypten', 'Iran', 'Neuseeland'],
  H: ['Spanien', 'Kap Verde', 'Saudi-Arabien', 'Uruguay'],
  I: ['Frankreich', 'Senegal', 'Irak', 'Norwegen'],
  J: ['Argentinien', 'Algerien', 'Österreich', 'Jordanien'],
  K: ['Portugal', 'DR Kongo', 'Usbekistan', 'Kolumbien'],
  L: ['England', 'Kroatien', 'Ghana', 'Panama'],
};

// Alle Zeiten in Deutscher Zeit (CEST = UTC+2).
// Das Browserdatum des Nutzers bestimmt den Anstoß-Vergleich automatisch.
const GAMES = [
  // ================================================
  // GRUPPENPHASE – SPIELTAG 1 (11.–17. Juni)
  // ================================================


  // 11. Juni – Gruppe A
  { id:  1, group: 'A', round: 'Gruppenphase', home: 'Mexico',               away: 'Südafrika',           kickoff: '2026-06-11T21:00', venue: 'Estadio Azteca, Mexico City' },

  // 12. Juni – Gruppe A + B
  { id:  2, group: 'A', round: 'Gruppenphase', home: 'Südkorea',             away: 'Tschechien',          kickoff: '2026-06-12T04:00', venue: 'Estadio Akron, Guadalajara' },
  { id:  3, group: 'B', round: 'Gruppenphase', home: 'Kanada',               away: 'Bosnien-Herzegowina', kickoff: '2026-06-12T21:00', venue: 'BMO Field, Toronto' },

  // 13. Juni – Gruppe D + B
  { id:  4, group: 'D', round: 'Gruppenphase', home: 'USA',                  away: 'Paraguay',            kickoff: '2026-06-13T03:00', venue: 'SoFi Stadium, Los Angeles' },
  { id:  8, group: 'B', round: 'Gruppenphase', home: 'Katar',                away: 'Schweiz',             kickoff: '2026-06-13T21:00', venue: "Levi's Stadium, San Francisco" },

  // 14. Juni – Gruppe C + D + E + F
  { id:  7, group: 'C', round: 'Gruppenphase', home: 'Brasilien',            away: 'Marokko',             kickoff: '2026-06-14T00:00', venue: 'MetLife Stadium, New York' },
  { id:  5, group: 'C', round: 'Gruppenphase', home: 'Haiti',                away: 'Schottland',          kickoff: '2026-06-14T03:00', venue: 'Gillette Stadium, Boston' },
  { id:  6, group: 'D', round: 'Gruppenphase', home: 'Australien',           away: 'Türkei',              kickoff: '2026-06-14T06:00', venue: 'BC Place, Vancouver' },
  { id: 10, group: 'E', round: 'Gruppenphase', home: 'Deutschland',          away: 'Curaçao',             kickoff: '2026-06-14T19:00', venue: 'NRG Stadium, Houston' },
  { id: 11, group: 'F', round: 'Gruppenphase', home: 'Niederlande',          away: 'Japan',               kickoff: '2026-06-14T22:00', venue: 'AT&T Stadium, Dallas' },

  // 15. Juni – Gruppe E + F + H + G
  { id:  9, group: 'E', round: 'Gruppenphase', home: 'Elfenbeinküste',       away: 'Ecuador',             kickoff: '2026-06-15T01:00', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 12, group: 'F', round: 'Gruppenphase', home: 'Schweden',             away: 'Tunesien',            kickoff: '2026-06-15T04:00', venue: 'Estadio BBVA, Monterrey' },
  { id: 14, group: 'H', round: 'Gruppenphase', home: 'Spanien',              away: 'Kap Verde',           kickoff: '2026-06-15T18:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 16, group: 'G', round: 'Gruppenphase', home: 'Belgien',              away: 'Ägypten',             kickoff: '2026-06-15T21:00', venue: 'Lumen Field, Seattle' },

  // 16. Juni – Gruppe H + G + I
  { id: 13, group: 'H', round: 'Gruppenphase', home: 'Saudi-Arabien',        away: 'Uruguay',             kickoff: '2026-06-16T00:00', venue: 'Hard Rock Stadium, Miami' },
  { id: 15, group: 'G', round: 'Gruppenphase', home: 'Iran',                 away: 'Neuseeland',          kickoff: '2026-06-16T03:00', venue: 'SoFi Stadium, Los Angeles' },
  { id: 17, group: 'I', round: 'Gruppenphase', home: 'Frankreich',           away: 'Senegal',             kickoff: '2026-06-16T21:00', venue: 'MetLife Stadium, New York' },

  // 17. Juni – Gruppe I + J + K + L
  { id: 18, group: 'I', round: 'Gruppenphase', home: 'Irak',                 away: 'Norwegen',            kickoff: '2026-06-17T00:00', venue: 'Gillette Stadium, Boston' },
  { id: 19, group: 'J', round: 'Gruppenphase', home: 'Argentinien',          away: 'Algerien',            kickoff: '2026-06-17T03:00', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 20, group: 'J', round: 'Gruppenphase', home: 'Österreich',           away: 'Jordanien',           kickoff: '2026-06-17T06:00', venue: "Levi's Stadium, San Francisco" },
  { id: 23, group: 'K', round: 'Gruppenphase', home: 'Portugal',             away: 'DR Kongo',            kickoff: '2026-06-17T19:00', venue: 'NRG Stadium, Houston' },
  { id: 22, group: 'L', round: 'Gruppenphase', home: 'England',              away: 'Kroatien',            kickoff: '2026-06-17T22:00', venue: 'AT&T Stadium, Dallas' },

  // 18. Juni – Gruppe L + K + A + B
  { id: 21, group: 'L', round: 'Gruppenphase', home: 'Ghana',                away: 'Panama',              kickoff: '2026-06-18T01:00', venue: 'BMO Field, Toronto' },
  { id: 24, group: 'K', round: 'Gruppenphase', home: 'Usbekistan',           away: 'Kolumbien',           kickoff: '2026-06-18T04:00', venue: 'Estadio Azteca, Mexico City' },
  { id: 25, group: 'A', round: 'Gruppenphase', home: 'Tschechien',           away: 'Südafrika',           kickoff: '2026-06-18T18:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 26, group: 'B', round: 'Gruppenphase', home: 'Schweiz',              away: 'Bosnien-Herzegowina', kickoff: '2026-06-18T21:00', venue: 'SoFi Stadium, Los Angeles' },

  // ================================================
  // GRUPPENPHASE – SPIELTAG 2 (18.–23. Juni)
  // ================================================

  // 19. Juni – Gruppe B + A + D
  { id: 27, group: 'B', round: 'Gruppenphase', home: 'Kanada',               away: 'Katar',               kickoff: '2026-06-19T00:00', venue: 'BC Place, Vancouver' },
  { id: 28, group: 'A', round: 'Gruppenphase', home: 'Mexico',               away: 'Südkorea',            kickoff: '2026-06-19T03:00', venue: 'Estadio Akron, Guadalajara' },
  { id: 32, group: 'D', round: 'Gruppenphase', home: 'USA',                  away: 'Australien',          kickoff: '2026-06-19T21:00', venue: 'Lumen Field, Seattle' },

  // 20. Juni – Gruppe C + D + F + E
  { id: 30, group: 'C', round: 'Gruppenphase', home: 'Schottland',           away: 'Marokko',             kickoff: '2026-06-20T00:00', venue: 'Gillette Stadium, Boston' },
  { id: 29, group: 'C', round: 'Gruppenphase', home: 'Brasilien',            away: 'Haiti',               kickoff: '2026-06-20T02:30', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 31, group: 'D', round: 'Gruppenphase', home: 'Türkei',               away: 'Paraguay',            kickoff: '2026-06-20T05:00', venue: "Levi's Stadium, San Francisco" },
  { id: 35, group: 'F', round: 'Gruppenphase', home: 'Niederlande',          away: 'Schweden',            kickoff: '2026-06-20T19:00', venue: 'Estadio BBVA, Monterrey' },
  { id: 33, group: 'E', round: 'Gruppenphase', home: 'Deutschland',          away: 'Elfenbeinküste',      kickoff: '2026-06-20T22:00', venue: 'BMO Field, Toronto' },

  // 21. Juni – Gruppe E + F + H + G
  { id: 34, group: 'E', round: 'Gruppenphase', home: 'Ecuador',              away: 'Curaçao',             kickoff: '2026-06-21T02:00', venue: 'Arrowhead Stadium, Kansas City' },
  { id: 36, group: 'F', round: 'Gruppenphase', home: 'Tunesien',             away: 'Japan',               kickoff: '2026-06-21T06:00', venue: 'NRG Stadium, Houston' },
  { id: 38, group: 'H', round: 'Gruppenphase', home: 'Spanien',              away: 'Saudi-Arabien',       kickoff: '2026-06-21T18:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 39, group: 'G', round: 'Gruppenphase', home: 'Belgien',              away: 'Iran',                kickoff: '2026-06-21T21:00', venue: 'SoFi Stadium, Los Angeles' },

  // 22. Juni – Gruppe H + G + J + I
  { id: 37, group: 'H', round: 'Gruppenphase', home: 'Uruguay',              away: 'Kap Verde',           kickoff: '2026-06-22T00:00', venue: 'Hard Rock Stadium, Miami' },
  { id: 40, group: 'G', round: 'Gruppenphase', home: 'Neuseeland',           away: 'Ägypten',             kickoff: '2026-06-22T03:00', venue: 'BC Place, Vancouver' },
  { id: 43, group: 'J', round: 'Gruppenphase', home: 'Argentinien',          away: 'Österreich',          kickoff: '2026-06-22T19:00', venue: 'AT&T Stadium, Dallas' },
  { id: 42, group: 'I', round: 'Gruppenphase', home: 'Frankreich',           away: 'Irak',                kickoff: '2026-06-22T23:00', venue: 'Lincoln Financial Field, Philadelphia' },

  // 23. Juni – Gruppe I + J + K + L
  { id: 41, group: 'I', round: 'Gruppenphase', home: 'Norwegen',             away: 'Senegal',             kickoff: '2026-06-23T02:00', venue: 'MetLife Stadium, New York' },
  { id: 44, group: 'J', round: 'Gruppenphase', home: 'Jordanien',            away: 'Algerien',            kickoff: '2026-06-23T05:00', venue: "Levi's Stadium, San Francisco" },
  { id: 47, group: 'K', round: 'Gruppenphase', home: 'Portugal',             away: 'Usbekistan',          kickoff: '2026-06-23T19:00', venue: 'NRG Stadium, Houston' },
  { id: 45, group: 'L', round: 'Gruppenphase', home: 'England',              away: 'Ghana',               kickoff: '2026-06-23T22:00', venue: 'BMO Field, Toronto' },

  // ================================================
  // GRUPPENPHASE – SPIELTAG 3 (24.–27. Juni)
  // Beide Spiele einer Gruppe laufen gleichzeitig!
  // ================================================

  // 24. Juni – Gruppe L + K + B
  { id: 46, group: 'L', round: 'Gruppenphase', home: 'Panama',               away: 'Kroatien',            kickoff: '2026-06-24T01:00', venue: 'Gillette Stadium, Boston' },
  { id: 48, group: 'K', round: 'Gruppenphase', home: 'Kolumbien',            away: 'DR Kongo',            kickoff: '2026-06-24T04:00', venue: 'Estadio Akron, Guadalajara' },
  { id: 51, group: 'B', round: 'Gruppenphase', home: 'Schweiz',              away: 'Kanada',              kickoff: '2026-06-24T21:00', venue: 'BC Place, Vancouver' },
  { id: 52, group: 'B', round: 'Gruppenphase', home: 'Bosnien-Herzegowina',  away: 'Katar',               kickoff: '2026-06-24T21:00', venue: 'Lumen Field, Seattle' },

  // 25. Juni – Gruppe C + A + E
  { id: 49, group: 'C', round: 'Gruppenphase', home: 'Schottland',           away: 'Brasilien',           kickoff: '2026-06-25T00:00', venue: 'Hard Rock Stadium, Miami' },
  { id: 50, group: 'C', round: 'Gruppenphase', home: 'Marokko',              away: 'Haiti',               kickoff: '2026-06-25T00:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 53, group: 'A', round: 'Gruppenphase', home: 'Tschechien',           away: 'Mexico',              kickoff: '2026-06-25T03:00', venue: 'Estadio Azteca, Mexico City' },
  { id: 54, group: 'A', round: 'Gruppenphase', home: 'Südafrika',            away: 'Südkorea',            kickoff: '2026-06-25T03:00', venue: 'Estadio BBVA, Monterrey' },
  { id: 55, group: 'E', round: 'Gruppenphase', home: 'Curaçao',              away: 'Elfenbeinküste',      kickoff: '2026-06-25T22:00', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 56, group: 'E', round: 'Gruppenphase', home: 'Ecuador',              away: 'Deutschland',         kickoff: '2026-06-25T22:00', venue: 'MetLife Stadium, New York' },

  // 26. Juni – Gruppe F + D + I
  { id: 57, group: 'F', round: 'Gruppenphase', home: 'Japan',                away: 'Schweden',            kickoff: '2026-06-26T01:00', venue: 'Estadio BBVA, Monterrey' },
  { id: 58, group: 'F', round: 'Gruppenphase', home: 'Tunesien',             away: 'Niederlande',         kickoff: '2026-06-26T01:00', venue: 'AT&T Stadium, Dallas' },
  { id: 59, group: 'D', round: 'Gruppenphase', home: 'Türkei',               away: 'USA',                 kickoff: '2026-06-26T04:00', venue: "Levi's Stadium, San Francisco" },
  { id: 60, group: 'D', round: 'Gruppenphase', home: 'Paraguay',             away: 'Australien',          kickoff: '2026-06-26T04:00', venue: 'SoFi Stadium, Los Angeles' },
  { id: 61, group: 'I', round: 'Gruppenphase', home: 'Norwegen',             away: 'Frankreich',          kickoff: '2026-06-26T21:00', venue: 'Gillette Stadium, Boston' },
  { id: 62, group: 'I', round: 'Gruppenphase', home: 'Senegal',              away: 'Irak',                kickoff: '2026-06-26T21:00', venue: 'BMO Field, Toronto' },

  // 27. Juni – Gruppe H + G + L
  { id: 65, group: 'H', round: 'Gruppenphase', home: 'Kap Verde',            away: 'Saudi-Arabien',       kickoff: '2026-06-27T02:00', venue: 'NRG Stadium, Houston' },
  { id: 66, group: 'H', round: 'Gruppenphase', home: 'Uruguay',              away: 'Spanien',             kickoff: '2026-06-27T02:00', venue: 'Estadio Akron, Guadalajara' },
  { id: 63, group: 'G', round: 'Gruppenphase', home: 'Ägypten',              away: 'Iran',                kickoff: '2026-06-27T05:00', venue: 'BC Place, Vancouver' },
  { id: 64, group: 'G', round: 'Gruppenphase', home: 'Neuseeland',           away: 'Belgien',             kickoff: '2026-06-27T05:00', venue: 'Lumen Field, Seattle' },
  { id: 67, group: 'L', round: 'Gruppenphase', home: 'Panama',               away: 'England',             kickoff: '2026-06-27T23:00', venue: 'BMO Field, Toronto' },
  { id: 68, group: 'L', round: 'Gruppenphase', home: 'Kroatien',             away: 'Ghana',               kickoff: '2026-06-27T23:00', venue: 'MetLife Stadium, New York' },

  // 28. Juni – Gruppe K + J
  { id: 71, group: 'K', round: 'Gruppenphase', home: 'Kolumbien',            away: 'Portugal',            kickoff: '2026-06-28T01:30', venue: 'Hard Rock Stadium, Miami' },
  { id: 72, group: 'K', round: 'Gruppenphase', home: 'DR Kongo',             away: 'Usbekistan',          kickoff: '2026-06-28T01:30', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 69, group: 'J', round: 'Gruppenphase', home: 'Algerien',             away: 'Österreich',          kickoff: '2026-06-28T04:00', venue: 'AT&T Stadium, Dallas' },
  { id: 70, group: 'J', round: 'Gruppenphase', home: 'Jordanien',            away: 'Argentinien',         kickoff: '2026-06-28T04:00', venue: 'Arrowhead Stadium, Kansas City' },

  // ================================================
  // RUNDE DER 32 (28. Juni – 4. Juli)
  // Admin kann Teamnamen im Admin-Panel anpassen!
  // ================================================
  { id: 73,  group: null, round: 'Runde der 32', home: '2. Gr. A',          away: '2. Gr. B',           kickoff: '2026-06-28T21:00', venue: 'SoFi Stadium, Los Angeles' },
  { id: 76,  group: null, round: 'Runde der 32', home: '1. Gr. C',          away: '2. Gr. F',           kickoff: '2026-06-29T19:00', venue: 'NRG Stadium, Houston' },
  { id: 74,  group: null, round: 'Runde der 32', home: '1. Gr. E',          away: 'Bester 3. (ABCDF)', kickoff: '2026-06-29T22:30', venue: 'Gillette Stadium, Boston' },
  { id: 75,  group: null, round: 'Runde der 32', home: '1. Gr. F',          away: '2. Gr. C',           kickoff: '2026-06-30T01:00', venue: 'Estadio BBVA, Monterrey' },
  { id: 78,  group: null, round: 'Runde der 32', home: '2. Gr. E',          away: '2. Gr. I',           kickoff: '2026-06-30T19:00', venue: 'AT&T Stadium, Dallas' },
  { id: 77,  group: null, round: 'Runde der 32', home: '1. Gr. I',          away: 'Bester 3. (CDFGH)', kickoff: '2026-06-30T23:00', venue: 'MetLife Stadium, New York' },
  { id: 79,  group: null, round: 'Runde der 32', home: '1. Gr. A',          away: 'Bester 3. (CEFHI)', kickoff: '2026-07-01T01:00', venue: 'Estadio Azteca, Mexico City' },
  { id: 80,  group: null, round: 'Runde der 32', home: '1. Gr. L',          away: 'Bester 3. (EHIJK)', kickoff: '2026-07-01T18:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 82,  group: null, round: 'Runde der 32', home: '1. Gr. G',          away: 'Bester 3. (AEHIJ)', kickoff: '2026-07-01T22:00', venue: 'Lumen Field, Seattle' },
  { id: 81,  group: null, round: 'Runde der 32', home: '1. Gr. D',          away: 'Bester 3. (BEFIJ)', kickoff: '2026-07-02T02:00', venue: "Levi's Stadium, San Francisco" },
  { id: 84,  group: null, round: 'Runde der 32', home: '1. Gr. H',          away: '2. Gr. J',           kickoff: '2026-07-02T21:00', venue: 'SoFi Stadium, Los Angeles' },
  { id: 83,  group: null, round: 'Runde der 32', home: '2. Gr. K',          away: '2. Gr. L',           kickoff: '2026-07-03T01:00', venue: 'BMO Field, Toronto' },
  { id: 85,  group: null, round: 'Runde der 32', home: '1. Gr. B',          away: 'Bester 3. (EFGIJ)', kickoff: '2026-07-03T05:00', venue: 'BC Place, Vancouver' },
  { id: 88,  group: null, round: 'Runde der 32', home: '2. Gr. D',          away: '2. Gr. G',           kickoff: '2026-07-03T20:00', venue: 'AT&T Stadium, Dallas' },
  { id: 86,  group: null, round: 'Runde der 32', home: '1. Gr. J',          away: '2. Gr. H',           kickoff: '2026-07-04T00:00', venue: 'Hard Rock Stadium, Miami' },
  { id: 87,  group: null, round: 'Runde der 32', home: '1. Gr. K',          away: 'Bester 3. (DEIJL)', kickoff: '2026-07-04T01:30', venue: 'Arrowhead Stadium, Kansas City' },

  // ================================================
  // ACHTELFINALE (4.–7. Juli)
  // ================================================
  { id: 90,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 73', away: 'Sieger Sp. 75', kickoff: '2026-07-04T19:00', venue: 'NRG Stadium, Houston' },
  { id: 89,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 74', away: 'Sieger Sp. 77', kickoff: '2026-07-04T23:00', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 91,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 76', away: 'Sieger Sp. 78', kickoff: '2026-07-05T22:00', venue: 'Lincoln Financial Field, Philadelphia' },
  { id: 92,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 79', away: 'Sieger Sp. 80', kickoff: '2026-07-06T02:00', venue: 'Estadio Azteca, Mexico City' },
  { id: 93,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 83', away: 'Sieger Sp. 84', kickoff: '2026-07-06T21:00', venue: 'Estadio Azteca, Mexico City' },
  { id: 94,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 81', away: 'Sieger Sp. 82', kickoff: '2026-07-07T02:00', venue: 'Lumen Field, Seattle' },
  { id: 95,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 86', away: 'Sieger Sp. 88', kickoff: '2026-07-07T18:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { id: 96,  group: null, round: 'Achtelfinale', home: 'Sieger Sp. 85', away: 'Sieger Sp. 87', kickoff: '2026-07-07T22:00', venue: 'BC Place, Vancouver' },

  // ================================================
  // VIERTELFINALE (9.–11. Juli)
  // ================================================
  { id: 97,  group: null, round: 'Viertelfinale', home: 'Sieger Sp. 89', away: 'Sieger Sp. 90', kickoff: '2026-07-09T22:00', venue: 'Gillette Stadium, Boston' },
  { id: 98,  group: null, round: 'Viertelfinale', home: 'Sieger Sp. 93', away: 'Sieger Sp. 94', kickoff: '2026-07-10T21:00', venue: 'SoFi Stadium, Los Angeles' },
  { id: 99,  group: null, round: 'Viertelfinale', home: 'Sieger Sp. 91', away: 'Sieger Sp. 92', kickoff: '2026-07-11T23:00', venue: 'Hard Rock Stadium, Miami' },
  { id: 100, group: null, round: 'Viertelfinale', home: 'Sieger Sp. 95', away: 'Sieger Sp. 96', kickoff: '2026-07-12T01:00', venue: 'Arrowhead Stadium, Kansas City' },

  // ================================================
  // HALBFINALE (14.–15. Juli)
  // ================================================
  { id: 101, group: null, round: 'Halbfinale', home: 'Sieger Sp. 97',  away: 'Sieger Sp. 98',  kickoff: '2026-07-14T21:00', venue: 'AT&T Stadium, Dallas' },
  { id: 102, group: null, round: 'Halbfinale', home: 'Sieger Sp. 99',  away: 'Sieger Sp. 100', kickoff: '2026-07-15T21:00', venue: 'Mercedes-Benz Stadium, Atlanta' },

  // ================================================
  // SPIEL UM PLATZ 3 (18. Juli)
  // ================================================
  { id: 103, group: null, round: 'Spiel um Platz 3', home: 'Verlierer Sp. 101', away: 'Verlierer Sp. 102', kickoff: '2026-07-18T23:00', venue: 'Hard Rock Stadium, Miami' },

  // ================================================
  // FINALE (19. Juli)
  // ================================================
  { id: 104, group: null, round: 'Finale', home: 'Sieger Sp. 101', away: 'Sieger Sp. 102', kickoff: '2026-07-19T21:00', venue: 'MetLife Stadium, New York' },
];
