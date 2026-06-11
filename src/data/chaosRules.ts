export type ChaosRarity = 'common' | 'rare' | 'legendary';

export const commonChaosRules = [
  'Ingen må sige “ja”. Fejl = 2 slurk.',
  'Ingen må sige “nej”. Fejl = 2 slurk.',
  'Alle skal drikke med den modsatte hånd.',
  'Man skal skåle før man drikker.',
  'Ingen må bruge navne. Fejl = 2 slurk.',
  '👑 {NAME} er mini-konge og må dele 2 slurke ud.',
  '🤖 {NAME} skal tale som en robot.',
  '🎤 {NAME} skal synge den næste sætning de siger.',
  'Den der griner først tager 2 slurk.',
  'Hvis nogen rører deres telefon, tager de 2 slurk.',
];

export const rareChaosRules = [
  '⚖️ {NAME} er dommer i 3 ture og må give 1 straf pr. tur.',
  '🛡️ {NAME} er bodyguard og må tage én straf for en anden spiller.',
  'Dobbelt straf: næste gang nogen skal drikke, tager de én ekstra slurk.',
  'Stille-runde: Ingen må snakke før næste kort er læst færdigt.',
  '⛓️ Kædereaktion: Når én drikker, vælger de en anden der også tager 2 slurk.',
  'Ingen første navne i 3 ture. Fejl = 2 slurke.',
  'Alle skal tale med accent indtil reglen udløber.',
  'Hvis nogen siger “hvad?”, tager de 2 slurk.',
];

export const legendaryChaosRules = [
  '👑 {NAME} er Kaoskonge og må dele 5 slurke ud frit.',
  '⚔️ {NAME} vælger to spillere til en duel. Taberen tager 3 slurke.',
  '🌪️ Total kaos: Alle aktive regler gælder én ekstra tur.',
  '💀 Boss round: Alle tager 3 slurke, og næste kort må ikke springes over.',
  '🔥 Fælles straf: Næste straf rammer alle spillere.',
  '🌩️ Regelstorm: Træk 2 chaos-regler mere med det samme.',
];