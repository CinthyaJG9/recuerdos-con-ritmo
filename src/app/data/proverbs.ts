export interface Proverb {
  id: string;
  firstPart: string;
  correctEnding: string;
  options: string[];
  hint?: string;
}

export const proverbs: Proverb[] = [
  {
    id: '1',
    firstPart: 'Más vale pájaro en mano...',
    correctEnding: 'que cien volando',
    options: ['que cien volando', 'que águila en el cielo', 'que paloma en el tejado'],
    hint: 'Es mejor tener algo seguro'
  },
  {
    id: '2',
    firstPart: 'Al que madruga...',
    correctEnding: 'Dios lo ayuda',
    options: ['Dios lo ayuda', 'el sueño lo vence', 'le da el sol'],
    hint: 'Habla sobre levantarse temprano'
  },
  {
    id: '3',
    firstPart: 'Camarón que se duerme...',
    correctEnding: 'se lo lleva la corriente',
    options: ['se lo lleva la corriente', 'pierde la cena', 'no pesca nada'],
    hint: 'Sobre estar alerta'
  },
  {
    id: '4',
    firstPart: 'Más vale tarde...',
    correctEnding: 'que nunca',
    options: ['que nunca', 'que a destiempo', 'que de prisa'],
    hint: 'Es mejor llegar aunque sea con retraso'
  },
  {
    id: '5',
    firstPart: 'A caballo regalado...',
    correctEnding: 'no se le mira el colmillo',
    options: ['no se le mira el colmillo', 'no se le pone silla', 'se le da las gracias'],
    hint: 'No criticar lo que te dan'
  },
  {
    id: '6',
    firstPart: 'No por mucho madrugar...',
    correctEnding: 'amanece más temprano',
    options: ['amanece más temprano', 'se llega más lejos', 'se trabaja mejor'],
    hint: 'Apurarse no siempre acelera las cosas'
  },
  {
    id: '7',
    firstPart: 'Dime con quién andas...',
    correctEnding: 'y te diré quién eres',
    options: ['y te diré quién eres', 'y sabré tu nombre', 'y conoceré tu casa'],
    hint: 'Las compañías dicen mucho de ti'
  },
  {
    id: '8',
    firstPart: 'En boca cerrada...',
    correctEnding: 'no entran moscas',
    options: ['no entran moscas', 'no hay palabras', 'se guarda el secreto'],
    hint: 'A veces es mejor callar'
  },
  {
    id: '9',
    firstPart: 'Del dicho al hecho...',
    correctEnding: 'hay mucho trecho',
    options: ['hay mucho trecho', 'es un paso', 'va la verdad'],
    hint: 'Entre prometer y cumplir hay diferencia'
  },
  {
    id: '10',
    firstPart: 'Árbol que nace torcido...',
    correctEnding: 'jamás su tronco endereza',
    options: ['jamás su tronco endereza', 'siempre da sombra', 'nunca crece derecho'],
    hint: 'Lo que se aprende de niño permanece'
  },
  {
    id: '11',
    firstPart: 'El que mucho abarca...',
    correctEnding: 'poco aprieta',
    options: ['poco aprieta', 'todo lo pierde', 'nada consigue'],
    hint: 'Hacer muchas cosas a la vez sale mal'
  },
  {
    id: '12',
    firstPart: 'Cría cuervos...',
    correctEnding: 'y te sacarán los ojos',
    options: ['y te sacarán los ojos', 'y serán negros', 'y volarán lejos'],
    hint: 'A veces ayudar puede volverse en tu contra'
  }
];
