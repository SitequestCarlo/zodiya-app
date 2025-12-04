import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ZodiacIconProps {
  size?: number;
  color?: string;
}

export const AriesIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5a5 5 0 1 0 -4 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 13a5 5 0 1 0 -4 -8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 21l0 -16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TaurusIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 3a6 6 0 0 0 12 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 21a7 7 0 0 0 0 -14a7 7 0 0 0 0 14z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const GeminiIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3a21 21 0 0 0 18 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 21a21 21 0 0 1 18 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 3l0 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 3l0 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CancerIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 12a9 9 0 0 1 9 -9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 12a9 9 0 0 1 -9 9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const LeoIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M13 17a4 4 0 1 0 8 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M11 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 7c0 3 2 5 2 9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 7c0 4 -2 6 -2 10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const VirgoIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 4a2 2 0 0 1 2 2v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 6a2 2 0 0 1 4 0v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 6a2 2 0 0 1 4 0v10a7 7 0 0 0 7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 21a7 7 0 0 0 7 -7v-2a2 2 0 0 0 -4 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const LibraIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 20l14 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 17h5v-.3a7 7 0 1 1 4 0v.3h5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ScorpioIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 4a2 2 0 0 1 2 2v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 6a2 2 0 0 1 4 0v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 6a2 2 0 0 1 4 0v10a3 3 0 0 0 3 3h5l-3 -3m0 6l3 -3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SagittariusIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 20l16 -16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13 4h7v7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6.5 12.5l5 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CapricornIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4a3 3 0 0 1 3 3v9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 7a3 3 0 0 1 6 0v11a3 3 0 0 0 3 3h3a3 3 0 0 0 -3 -3v-5a3 3 0 1 0 -6 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AquariusIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 10l3 -3l3 3l3 -3l3 3l3 -3l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 17l3 -3l3 3l3 -3l3 3l3 -3l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PiscesIcon = ({ size = 24, color = '#000' }: ZodiacIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 3a21 21 0 0 1 0 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 3a21 21 0 0 0 0 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 12l14 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Map Latin sign names to their icon components
export const ZodiacIconMap: Record<string, React.FC<ZodiacIconProps>> = {
  'Aries': AriesIcon,
  'Taurus': TaurusIcon,
  'Gemini': GeminiIcon,
  'Cancer': CancerIcon,
  'Leo': LeoIcon,
  'Virgo': VirgoIcon,
  'Libra': LibraIcon,
  'Scorpio': ScorpioIcon,
  'Sagittarius': SagittariusIcon,
  'Capricorn': CapricornIcon,
  'Aquarius': AquariusIcon,
  'Pisces': PiscesIcon,
};

// Map Latin sign names to German names
export const ZodiacGermanNames: Record<string, string> = {
  'Aries': 'Widder',
  'Taurus': 'Stier',
  'Gemini': 'Zwillinge',
  'Cancer': 'Krebs',
  'Leo': 'Löwe',
  'Virgo': 'Jungfrau',
  'Libra': 'Waage',
  'Scorpio': 'Skorpion',
  'Sagittarius': 'Schütze',
  'Capricorn': 'Steinbock',
  'Aquarius': 'Wassermann',
  'Pisces': 'Fische',
};

// Map Latin sign names to date ranges
export const ZodiacDateRanges: Record<string, string> = {
  'Aries': '21. März – 20. April',
  'Taurus': '21. April – 20. Mai',
  'Gemini': '21. Mai – 21. Juni',
  'Cancer': '22. Juni – 22. Juli',
  'Leo': '23. Juli – 23. August',
  'Virgo': '24. August – 23. September',
  'Libra': '24. September – 23. Oktober',
  'Scorpio': '24. Oktober – 22. November',
  'Sagittarius': '23. November – 21. Dezember',
  'Capricorn': '22. Dezember – 20. Januar',
  'Aquarius': '21. Januar – 19. Februar',
  'Pisces': '20. Februar – 20. März',
};

// Map Latin sign names to descriptive texts
export const ZodiacDescriptions: Record<string, string> = {
  'Aries': 'Du bist mutig, direkt und voller Lebensenergie. In dir brennt das Feuer des Anfangs – du willst Dinge ins Rollen bringen und nicht lange zögern. Deine Stärke liegt im Handeln, doch wahre Kraft entsteht, wenn du lernst, auch innezuhalten und bewusst zu lenken.',
  'Taurus': 'Du liebst Beständigkeit, Sinnlichkeit und die Schönheit des Greifbaren. Sicherheit und Verlässlichkeit geben dir Halt, und du genießt das Leben mit allen Sinnen. Deine Entwicklung beginnt dort, wo du Veränderung zulässt, ohne dich zu verlieren.',
  'Gemini': 'Du bist neugierig, kommunikativ und geistig ständig in Bewegung. Worte und Ideen sind dein Element, du suchst den Austausch und liebst Vielfalt. Deine Herausforderung liegt darin, Tiefe zu finden – nicht alles muss gesagt, aber vieles verstanden werden.',
  'Cancer': 'Du bist feinfühlig, fürsorglich und emotional tief verbunden. Nähe und Geborgenheit bedeuten dir viel, und du gibst anderen gerne ein Zuhause. Doch achte darauf, deine eigenen Grenzen zu wahren – Selbstfürsorge ist die Basis deiner Stärke.',
  'Leo': 'Du trägst Sonne im Herzen und strahlst, wenn du dich ausdrücken darfst. Kreativität, Mut und Großzügigkeit machen dich aus. Du inspirierst andere durch dein Wesen – solange du nicht Bestätigung suchst, sondern einfach du selbst bist.',
  'Virgo': 'Du beobachtest genau, erkennst Muster und willst verbessern, was unvollkommen scheint. Struktur und Klarheit geben dir Sicherheit. Doch Perfektion ist kein Ziel – deine größte Stärke liegt in deinem aufrichtigen Wunsch, zu dienen und zu verstehen.',
  'Libra': 'Du bist diplomatisch, ästhetisch und suchst Harmonie in allem, was dich umgibt. Beziehungen bedeuten dir viel – sie spiegeln, wer du bist. Dein Weg führt dich zur inneren Balance: Wenn du zu dir selbst stehst, entsteht wahre Schönheit.',
  'Scorpio': 'Du bist intensiv, leidenschaftlich und suchst nach Wahrheit – auch dort, wo andere zurückschrecken. Transformation ist dein Thema: Du willst durchdringen, was verborgen ist. Deine Kraft liegt darin, loszulassen und Vertrauen zu wagen.',
  'Sagittarius': 'Du bist offen, idealistisch und immer auf der Suche nach Sinn. Freiheit ist dein Antrieb, Wissen dein Kompass. Doch die größte Erkenntnis findest du, wenn du das, was du weißt, auch lebst – im Hier und Jetzt.',
  'Capricorn': 'Du bist verantwortungsbewusst, ausdauernd und zielstrebig. Du baust, was Bestand haben soll, und gehst deinen Weg mit Disziplin und Geduld. Vergiss dabei nicht: Auch du darfst weich sein – wahre Stärke braucht Herz.',
  'Aquarius': 'Du bist freiheitsliebend, originell und denkst anders als die meisten. Visionen und Ideen treiben dich an, du willst verändern, was festgefahren ist. Deine Herausforderung ist Nähe – du bleibst unabhängig, auch wenn du dich verbindest.',
  'Pisces': 'Du bist sensibel, mitfühlend und tief verbunden mit dem Unsichtbaren. Deine Welt ist die Intuition, nicht die Logik. Du spürst, was andere fühlen – achte darauf, dich dabei nicht zu verlieren. In deiner Empathie liegt dein größtes Geschenk.',
};
