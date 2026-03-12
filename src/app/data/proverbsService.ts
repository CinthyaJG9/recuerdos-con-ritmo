// src/data/proverbsService.ts

export interface Proverb {
  id: string;
  firstPart: string;
  correctEnding: string;
  options: string[];
  hint: string;
  category: string;
}

// Refranes mexicanos auténticos
const MEXICAN_PROVERBS: Omit<Proverb, 'options'>[] = [
  {
    id: '1',
    firstPart: 'A caballo regalado',
    correctEnding: 'no se le ve el colmillo',
    hint: 'Es sobre no criticar regalos',
    category: 'sabiduría popular'
  },
  {
    id: '2',
    firstPart: 'Camarón que se duerme',
    correctEnding: 'se lo lleva la corriente',
    hint: 'Habla de quienes se confían',
    category: 'consejos'
  },
  {
    id: '3',
    firstPart: 'Más sabe el diablo por viejo',
    correctEnding: 'que por diablo',
    hint: 'La experiencia es importante',
    category: 'sabiduría popular'
  },
  {
    id: '4',
    firstPart: 'El que nace para maceta',
    correctEnding: 'del corredor no pasa',
    hint: 'Sobre conocer nuestros límites',
    category: 'destino'
  },
  {
    id: '5',
    firstPart: 'De tal palo',
    correctEnding: 'tal astilla',
    hint: 'Los hijos se parecen a los padres',
    category: 'familia'
  },
  {
    id: '6',
    firstPart: 'Cuando el río suena',
    correctEnding: 'agua lleva',
    hint: 'Los rumores tienen razón',
    category: 'dichos'
  },
  {
    id: '7',
    firstPart: 'Perro que ladra',
    correctEnding: 'no muerde',
    hint: 'Quien amenaza no siempre actúa',
    category: 'comportamiento'
  },
  {
    id: '8',
    firstPart: 'Aunque la mona se vista de seda',
    correctEnding: 'mona se queda',
    hint: 'Las apariencias engañan',
    category: 'apariencias'
  },
  {
    id: '9',
    firstPart: 'En boca cerrada',
    correctEnding: 'no entran moscas',
    hint: 'A veces es mejor callar',
    category: 'consejos'
  },
  {
    id: '10',
    firstPart: 'Más vale pájaro en mano',
    correctEnding: 'que ver un ciento volando',
    hint: 'Conforma con lo seguro',
    category: 'decisiones'
  },
  {
    id: '11',
    firstPart: 'No todo lo que brilla',
    correctEnding: 'es oro',
    hint: 'Las apariencias engañan',
    category: 'sabiduría'
  },
  {
    id: '12',
    firstPart: 'Zapatero a tus',
    correctEnding: 'zapatos',
    hint: 'Cada quien debe hacer lo que sabe',
    category: 'trabajo'
  },
  {
    id: '13',
    firstPart: 'Al que madruga',
    correctEnding: 'Dios le ayuda',
    hint: 'Ser tempranero tiene beneficios',
    category: 'consejos'
  },
  {
    id: '14',
    firstPart: 'Dime con quién andas',
    correctEnding: 'y te diré quién eres',
    hint: 'Las compañías dicen mucho de ti',
    category: 'comportamiento'
  },
  {
    id: '15',
    firstPart: 'Ojos que no ven',
    correctEnding: 'corazón que no siente',
    hint: 'Lo que ignoramos no nos afecta',
    category: 'sentimientos'
  }
];

// Opciones incorrectas comunes para refranes
const COMMON_WRONG_ENDINGS = [
  'no es lo que parece',
  'no siempre es cierto',
  'hay que tener cuidado',
  'mejor prevenir',
  'nunca es tarde',
  'todo llega a su tiempo',
  'no hay mal que dure cien años',
  'al que madruga Dios lo olvida',
  'el que busca encuentra',
  'no por mucho madrugar amanece más temprano',
  'cría fama y échate a dormir',
  'el hábito no hace al monje',
  'no es oro todo lo que reluce',
  'del dicho al hecho hay mucho trecho'
];

// Función para generar opciones mezcladas
const generateOptions = (correctEnding: string): string[] => {
  // Tomar 3 opciones incorrectas aleatorias que no sean la correcta
  const wrongOptions = COMMON_WRONG_ENDINGS
    .filter(ending => ending !== correctEnding)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  // Combinar correcta con incorrectas
  const allOptions = [correctEnding, ...wrongOptions];
  
  // Mezclar para que la correcta no esté siempre en la misma posición
  return allOptions.sort(() => 0.5 - Math.random());
};

// Función para construir refrán completo con opciones
const buildProverb = (base: Omit<Proverb, 'options'>): Proverb => {
  return {
    ...base,
    options: generateOptions(base.correctEnding)
  };
};

// Obtener refranes aleatorios sin repetir
export function getRandomProverbs(count: number = 8): Proverb[] {
  // Mezclar array y tomar los primeros 'count'
  const shuffled = [...MEXICAN_PROVERBS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, MEXICAN_PROVERBS.length));
  
  // Construir cada refrán con sus opciones mezcladas
  return selected.map(base => buildProverb(base));
}

// Obtener refranes por categoría
export function getProverbsByCategory(category: string, count: number = 5): Proverb[] {
  const filtered = MEXICAN_PROVERBS.filter(p => p.category === category);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, filtered.length));
  
  return selected.map(base => buildProverb(base));
}

// Obtener refrán aleatorio
export function getRandomProverb(): Proverb {
  const randomIndex = Math.floor(Math.random() * MEXICAN_PROVERBS.length);
  return buildProverb(MEXICAN_PROVERBS[randomIndex]);
}

// Para depuración - verificar que las opciones están mezcladas
export function debugProverbs() {
  const proverbs = getRandomProverbs(5);
  proverbs.forEach(p => {
    console.log(`Refrán: ${p.firstPart}`);
    console.log(`Correcta: ${p.correctEnding}`);
    console.log('Opciones:', p.options);
    console.log('Posición de correcta:', p.options.indexOf(p.correctEnding));
    console.log('---');
  });
}