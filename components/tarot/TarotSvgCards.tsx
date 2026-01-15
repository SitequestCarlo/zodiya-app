import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

// Import all tarot card components
import {
  TarotTheFool,
  TarotTheMagician,
  TarotTheHighPriestess,
  TarotTheEmpress,
  TarotTheEmperor,
  TarotTheHierophant,
  TarotTheLovers,
  TarotTheChariot,
  TarotStrength,
  TarotTheHermit,
  TarotWheelOfFortune,
  TarotJustice,
  TarotTheHangedMan,
  TarotDeath,
  TarotTemperance,
  TarotTheDevil,
  TarotTheTower,
  TarotTheStar,
  TarotTheMoon,
  TarotTheSun,
  TarotJudgement,
  TarotTheWorld,
} from './cards';

// Card names mapping with German names and descriptions
export const TAROT_CARDS = [
  { 
    id: 0, 
    name: 'Der Narr', 
    file: '00_Tarot_the-fool', 
    description: 'Ein Tag für Neuanfänge und Spontanität. Folge deiner Intuition und hab keine Angst, etwas zu wagen.',
    pastDescription: 'Du bist unbedarft gestartet, vielleicht ohne Plan – aber mit offenem Herzen. Diese Unschuld hat dir neue Wege eröffnet.',
    presentDescription: 'Du stehst am Anfang von etwas Neuem. Offenheit und Vertrauen führen dich jetzt weiter als Planung.',
    futureDescription: 'Ein neuer Weg öffnet sich. Vertrauen, Leichtigkeit und Mut werden dich weiterbringen als Planung allein.'
  },
  { 
    id: 1, 
    name: 'Der Magier', 
    file: '01_Tarot_the-magician', 
    description: 'Du hast heute alles, was du brauchst, um deine Pläne umzusetzen. Nutze deine Fähigkeiten bewusst.',
    pastDescription: 'Du hast gelernt, deine Fähigkeiten zu nutzen und Dinge aktiv zu gestalten. Früherer Einsatz zahlt sich jetzt aus.',
    presentDescription: 'Gerade hast du die Mittel, um aktiv zu gestalten. Nutze deine Fähigkeiten bewusst und zielgerichtet.',
    futureDescription: 'Du wirst deine Fähigkeiten gezielter einsetzen können. Selbstvertrauen und klare Absicht führen dich zum Erfolg.'
  },
  { 
    id: 2, 
    name: 'Die Hohepriesterin', 
    file: '02_Tarot_the-high-priestess', 
    description: 'Vertraue heute auf dein Bauchgefühl. Nicht alles muss sofort verstanden werden – lausche deiner inneren Stimme.',
    pastDescription: 'In der Vergangenheit hast du auf deine Intuition gehört – oder sie ignoriert. In jedem Fall hat sie dich geprägt.',
    presentDescription: 'Jetzt zählt dein inneres Wissen. Lausche deiner Intuition, auch wenn noch nicht alles sichtbar ist.',
    futureDescription: 'Bald wird dein inneres Wissen an Bedeutung gewinnen. Folge deinem Gefühl – es zeigt dir den richtigen Weg.'
  },
  { 
    id: 3, 
    name: 'Die Herrscherin', 
    file: '03_Tarot_the-empress', 
    description: 'Ein Tag voller Kreativität, Genuss und Fürsorge. Pflege dich selbst und deine Beziehungen.',
    pastDescription: 'Eine Zeit des Wachstums und der Fürsorge liegt hinter dir. Du hast etwas genährt – eine Idee, Beziehung oder dich selbst.',
    presentDescription: 'Du befindest dich in einer Phase des Wachstums und der Fürsorge. Kreativität und Empathie entfalten sich.',
    futureDescription: 'Eine Phase der Fülle und Kreativität steht bevor. Etwas, das du nährst, wird bald aufblühen.'
  },
  { 
    id: 4, 
    name: 'Der Herrscher', 
    file: '04_Tarot_the-emperor', 
    description: 'Struktur und Klarheit bringen heute Erfolg. Übernimm Verantwortung und setze Grenzen, wo nötig.',
    pastDescription: 'Du hast Strukturen geschaffen oder Kontrolle übernommen. Vielleicht warst du streng mit dir – doch es brachte Stabilität.',
    presentDescription: 'Ordnung und Klarheit spielen heute eine Rolle. Es kann hilfreich sein, Verantwortung zu übernehmen.',
    futureDescription: 'Zukünftig wirst du mehr Stabilität und Einfluss gewinnen. Klare Entscheidungen bringen Ordnung in dein Leben.'
  },
  { 
    id: 5, 
    name: 'Der Hierophant', 
    file: '05_Tarot_the-hierophant', 
    description: 'Tradition, Werte oder Mentoren können heute eine Rolle spielen. Suche Rat oder teile dein Wissen.',
    pastDescription: 'Du hast dich an Regeln, Glauben oder Tradition gehalten. Alte Werte haben dich geleitet – oder eingeschränkt.',
    presentDescription: 'Tradition, Werte oder spirituelle Orientierung begleiten dich. Vielleicht suchst du heute Halt im Bewährten.',
    futureDescription: 'Du findest Halt in Gemeinschaft oder spiritueller Tiefe. Alte Werte bekommen eine neue Bedeutung.'
  },
  { 
    id: 6, 
    name: 'Die Liebenden', 
    file: '06_Tarot_the-lovers', 
    description: 'Entscheidungen aus dem Herzen sind heute gefragt. Harmonie und Verbindung stehen im Mittelpunkt.',
    pastDescription: 'Eine wichtige Entscheidung oder Beziehung aus der Vergangenheit wirkt bis heute nach. Liebe und Bindung haben dich verändert.',
    presentDescription: 'Entscheidungen oder Beziehungen stehen im Mittelpunkt. Es geht darum, in Einklang mit deinem Herzen zu handeln.',
    futureDescription: 'Beziehungen oder Herzensentscheidungen rücken in den Vordergrund. Wahre Verbindung entsteht aus Offenheit.'
  },
  { 
    id: 7, 
    name: 'Der Wagen', 
    file: '07_Tarot_the-chariot', 
    description: 'Du hast die Zügel in der Hand! Mit Fokus und Entschlossenheit kommst du deinem Ziel näher.',
    pastDescription: 'Du bist entschlossen vorangeschritten, trotz Hindernissen. Deine Willenskraft hat dich weit gebracht.',
    presentDescription: 'Du bist in Bewegung – zielstrebig und bestimmt. Halte deine Richtung und bleib fokussiert.',
    futureDescription: 'Erfolg und Fortschritt stehen bevor. Mit Entschlossenheit und Fokus wirst du dein Ziel erreichen.'
  },
  { 
    id: 8, 
    name: 'Die Kraft', 
    file: '08_Tarot_strength', 
    description: 'Geduld und Mitgefühl bringen dich heute weiter als Druck. Stärke kommt von innen.',
    pastDescription: 'Du hast gelernt, Geduld und Sanftmut statt Druck einzusetzen. Eine frühere Herausforderung hat dich innerlich gestärkt.',
    presentDescription: 'Innere Ruhe und Vertrauen sind deine Stärke. Du begegnest Herausforderungen mit Sanftmut statt Zwang.',
    futureDescription: 'Du wirst deine innere Stärke beweisen. Geduld und Vertrauen helfen dir, jede Herausforderung zu meistern.'
  },
  { 
    id: 9, 
    name: 'Der Eremit', 
    file: '09_Tarot_the-hermit', 
    description: 'Zieh dich kurz zurück, um Klarheit zu finden. In der Stille liegt heute deine Stärke.',
    pastDescription: 'Eine Rückzugsphase brachte dir Erkenntnis. Du hast in der Stille Antworten gefunden – oder gesucht.',
    presentDescription: 'Eine Zeit des Rückzugs oder Nachdenkens kann dir jetzt Klarheit bringen. Stille ist kein Stillstand.',
    futureDescription: 'Eine Zeit der inneren Einkehr oder Selbstreflexion wartet. Du wirst Klarheit über deinen Weg finden.'
  },
  { 
    id: 10, 
    name: 'Das Rad des Schicksals', 
    file: '10_Tarot_wheel-of-fortune', 
    description: 'Veränderung liegt in der Luft. Vertraue darauf, dass sich alles zu deinem Besten entwickelt.',
    pastDescription: 'Schicksalhafte Ereignisse haben deine Richtung verändert. Du hast erlebt, wie wenig man manches kontrollieren kann.',
    presentDescription: 'Veränderung wirkt gerade in deinem Leben. Was sich dreht, kann neue Chancen eröffnen.',
    futureDescription: 'Das Leben wird Bewegung bringen. Unerwartete Wendungen können dich in eine günstige Richtung führen.'
  },
  { 
    id: 11, 
    name: 'Die Gerechtigkeit', 
    file: '11_Tarot_justice', 
    description: 'Fairness und Wahrheit zählen heute. Handle ehrlich – alles, was du gibst, kehrt zu dir zurück.',
    pastDescription: 'Du hast die Früchte deiner Taten geerntet – ob gerecht oder nicht. Diese Erfahrung hat dich über Verantwortung gelehrt.',
    presentDescription: 'Heute spiegelt sich Ursache und Wirkung. Handle bewusst, fair und im Einklang mit deiner Wahrheit.',
    futureDescription: 'Du wirst ernten, was du gesät hast. Künftige Ereignisse spiegeln deine heutigen Entscheidungen wider.'
  },
  { 
    id: 12, 
    name: 'Der Gehängte', 
    file: '12_Tarot_the-hanged-man', 
    description: 'Halte inne und betrachte Dinge aus einer neuen Perspektive. Loslassen kann befreiend sein.',
    pastDescription: 'Du warst in einer Phase des Stillstands oder musstest Opfer bringen. Diese Zeit hat dir neue Perspektiven eröffnet.',
    presentDescription: 'Im Moment könnte Stillstand herrschen. Vielleicht braucht eine Situation einen Perspektivwechsel.',
    futureDescription: 'Neue Einsichten werden kommen, wenn du loslässt. Eine andere Sichtweise öffnet dir ungeahnte Möglichkeiten.'
  },
  { 
    id: 13, 
    name: 'Der Tod', 
    file: '13_Tarot_death', 
    description: 'Ein Kapitel endet, ein neues beginnt. Heute darfst du Altes loslassen, um Platz für Neues zu schaffen.',
    pastDescription: 'Ein klarer Abschluss liegt hinter dir. Du hast etwas Altes losgelassen – auch wenn es schmerzhaft war.',
    presentDescription: 'Etwas Altes geht zu Ende, um Raum für Neues zu schaffen. Akzeptiere den Wandel – er bringt Erneuerung.',
    futureDescription: 'Ein wichtiger Wandel steht bevor. Indem du Altes verabschiedest, entsteht Platz für echtes Wachstum.'
  },
  { 
    id: 14, 
    name: 'Die Mäßigkeit', 
    file: '14_Tarot_temperance', 
    description: 'Balance ist heute der Schlüssel. Finde dein inneres Gleichgewicht und bleib gelassen.',
    pastDescription: 'Du hast gelernt, Maß zu halten und Gegensätze zu verbinden. Früherer Ausgleich hat dich in Balance gebracht.',
    presentDescription: 'Jetzt ist Ausgleich gefragt. Finde dein inneres Gleichgewicht zwischen Tun und Loslassen.',
    futureDescription: 'Künftige Harmonie und Ausgleich erwarten dich. Du findest deinen natürlichen Rhythmus wieder.'
  },
  { 
    id: 15, 
    name: 'Der Teufel', 
    file: '15_Tarot_the-devil', 
    description: 'Achte heute auf Versuchungen oder Gewohnheiten, die dich zurückhalten. Bewusstheit ist der erste Schritt zur Freiheit.',
    pastDescription: 'Du warst gefangen in Mustern oder Abhängigkeiten. Das Erkennen dieser Fesseln war der erste Schritt zur Befreiung.',
    presentDescription: 'Du erkennst gerade, was dich bindet oder begrenzt. Bewusstheit kann dich von alten Mustern befreien.',
    futureDescription: 'Du wirst dich mit alten Mustern konfrontieren, um sie zu überwinden. Freiheit entsteht durch Bewusstsein.'
  },
  { 
    id: 16, 
    name: 'Der Turm', 
    file: '16_Tarot_the-tower', 
    description: 'Ein plötzlicher Umbruch kann dich wachrütteln. Sieh ihn als Chance für Wachstum und Neubeginn.',
    pastDescription: 'Ein plötzlicher Umbruch hat vieles zerstört – aber dich auch wachgerüttelt. Daraus entstand Klarheit.',
    presentDescription: 'Alte Strukturen brechen auf. Auch wenn es unbequem ist – Klarheit entsteht aus Veränderung.',
    futureDescription: 'Ein Umbruch kann Altes zerstören, aber auch Befreiung bringen. Neues wird auf stabilerem Fundament entstehen.'
  },
  { 
    id: 17, 
    name: 'Der Stern', 
    file: '17_Tarot_the-star', 
    description: 'Hoffnung, Inspiration und Heilung begleiten dich heute. Glaube an dich und deine Vision.',
    pastDescription: 'Nach schweren Zeiten hast du Hoffnung geschöpft. Diese Zuversicht hat dich getragen und geheilt.',
    presentDescription: 'Hoffnung, Heilung und Vertrauen begleiten dich. Deine innere Ausrichtung zeigt den Weg.',
    futureDescription: 'Hoffnung und Heilung prägen deine Zukunft. Du findest Vertrauen in dich selbst und ins Leben zurück.'
  },
  { 
    id: 18, 
    name: 'Der Mond', 
    file: '18_Tarot_the-moon', 
    description: 'Nicht alles ist klar – vertraue deiner Intuition. Lass dich nicht von Ängsten leiten.',
    pastDescription: 'Verwirrung, Zweifel oder Illusionen prägten deine Vergangenheit. Doch du hast gelernt, deiner Intuition zu vertrauen.',
    presentDescription: 'Unklarheit oder Unsicherheit dürfen da sein. Vertraue auf dein Gefühl, nicht nur auf Fakten.',
    futureDescription: 'Ein Weg liegt noch im Schatten, doch Klarheit wird folgen. Vertraue deinem Instinkt auf dieser Reise.'
  },
  { 
    id: 19, 
    name: 'Die Sonne', 
    file: '19_Tarot_the-sun', 
    description: 'Freude, Erfolg und Leichtigkeit! Heute darfst du strahlen und das Leben genießen.',
    pastDescription: 'Eine glückliche Phase liegt hinter dir. Freude, Erfolg oder Liebe haben dein Selbstvertrauen gestärkt.',
    presentDescription: 'Du befindest dich in einer Phase der Klarheit und Freude. Licht und Leichtigkeit durchdringen deinen Tag.',
    futureDescription: 'Freude, Erfolg und Leichtigkeit warten auf dich. Du wirst ernten, was du mit Herz gesät hast.'
  },
  { 
    id: 20, 
    name: 'Das Gericht', 
    file: '20_Tarot_judgement', 
    description: 'Ein Tag der Erkenntnis und des Erwachens. Alte Themen können sich klären – befreie dich von Ballast.',
    pastDescription: 'Du hast alte Themen aufgearbeitet und bist innerlich erwacht. Vergangenheit wurde bewusst abgeschlossen.',
    presentDescription: 'Jetzt klären sich alte Themen. Du erkennst, was dich wirklich weiterbringt.',
    futureDescription: 'Ein inneres Erwachen steht bevor. Du wirst erkennen, was wirklich zählt – und dich danach ausrichten.'
  },
  { 
    id: 21, 
    name: 'Die Welt', 
    file: '21_Tarot_the-world', 
    description: 'Ein Zyklus schließt sich erfolgreich. Feiere, was du erreicht hast, und öffne dich neuen Möglichkeiten.',
    pastDescription: 'Ein Zyklus fand seinen Abschluss. Du hast etwas Großes vollendet und bist gewachsen daran.',
    presentDescription: 'Ein Zyklus schließt sich. Du erlebst Vollendung und bereitest dich auf das Nächste vor.',
    futureDescription: 'Vollendung und Erfolg kommen auf dich zu. Du erreichst ein Ziel und öffnest dich gleichzeitig für neue Horizonte.'
  },
];

// Map card file names to their React components
const cardComponents: Record<string, React.FC<{ width?: number; height?: number; color?: string; backgroundColor?: string }>> = {
  '00_Tarot_the-fool': TarotTheFool,
  '01_Tarot_the-magician': TarotTheMagician,
  '02_Tarot_the-high-priestess': TarotTheHighPriestess,
  '03_Tarot_the-empress': TarotTheEmpress,
  '04_Tarot_the-emperor': TarotTheEmperor,
  '05_Tarot_the-hierophant': TarotTheHierophant,
  '06_Tarot_the-lovers': TarotTheLovers,
  '07_Tarot_the-chariot': TarotTheChariot,
  '08_Tarot_strength': TarotStrength,
  '09_Tarot_the-hermit': TarotTheHermit,
  '10_Tarot_wheel-of-fortune': TarotWheelOfFortune,
  '11_Tarot_justice': TarotJustice,
  '12_Tarot_the-hanged-man': TarotTheHangedMan,
  '13_Tarot_death': TarotDeath,
  '14_Tarot_temperance': TarotTemperance,
  '15_Tarot_the-devil': TarotTheDevil,
  '16_Tarot_the-tower': TarotTheTower,
  '17_Tarot_the-star': TarotTheStar,
  '18_Tarot_the-moon': TarotTheMoon,
  '19_Tarot_the-sun': TarotTheSun,
  '20_Tarot_judgement': TarotJudgement,
  '21_Tarot_the-world': TarotTheWorld,
};

interface TarotCardImageProps {
  cardFile: string;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export const TarotCardImage: React.FC<TarotCardImageProps> = ({
  cardFile,
  width = 140,
  height = 240,
  color = 'black',
  backgroundColor = 'white',
}) => {
  const CardComponent = cardComponents[cardFile];
  
  if (!CardComponent) {
    return <View style={[styles.cardContainer, { width, height, backgroundColor: '#eee' }]} />;
  }

  return (
    <View style={[styles.cardContainer, { width, height }]}>
      <CardComponent 
        width={width} 
        height={height} 
        color={color}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      // @ts-ignore - web-specific styling
      boxShadow: 'none',
      filter: 'none',
      WebkitBoxShadow: 'none',
      WebkitFilter: 'none',
    }),
  },
});

export default TarotCardImage;
