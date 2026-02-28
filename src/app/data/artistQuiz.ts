export interface ArtistQuestion {
  id: string;
  songTitle: string;
  correctArtist: string;
  options: string[];
  decade: string;
  hint?: string;
}

export const artistQuestions: ArtistQuestion[] = [
  {
    id: '1',
    songTitle: 'La Barca',
    correctArtist: 'Lucha Villa',
    options: ['Lucha Villa', 'Lola Beltrán', 'Amalia Mendoza'],
    decade: '1960',
    hint: 'Conocida como "El alma que canta"'
  },
  {
    id: '2',
    songTitle: 'Cucurrucucú Paloma',
    correctArtist: 'Lola Beltrán',
    options: ['Lola Beltrán', 'Chavela Vargas', 'Lucha Villa'],
    decade: '1960',
    hint: 'La Grande de México'
  },
  {
    id: '3',
    songTitle: 'Amor Eterno',
    correctArtist: 'Juan Gabriel',
    options: ['Juan Gabriel', 'José José', 'Vicente Fernández'],
    decade: '1984',
    hint: 'El Divo de Juárez'
  },
  {
    id: '4',
    songTitle: 'Somos Novios',
    correctArtist: 'Armando Manzanero',
    options: ['Armando Manzanero', 'Álvaro Carrillo', 'Roberto Cantoral'],
    decade: '1968',
    hint: 'Compositor yucateco'
  },
  {
    id: '5',
    songTitle: 'Volver Volver',
    correctArtist: 'Vicente Fernández',
    options: ['Vicente Fernández', 'Pedro Infante', 'Jorge Negrete'],
    decade: '1976',
    hint: 'El Charro de Huentitán'
  },
  {
    id: '6',
    songTitle: 'El Triste',
    correctArtist: 'José José',
    options: ['José José', 'Roberto Carlos', 'Marco Antonio Solís'],
    decade: '1970',
    hint: 'El Príncipe de la Canción'
  },
  {
    id: '7',
    songTitle: 'Sabor a Mí',
    correctArtist: 'Álvaro Carrillo',
    options: ['Álvaro Carrillo', 'Agustín Lara', 'Consuelo Velázquez'],
    decade: '1959',
    hint: 'Compositor de boleros clásicos'
  },
  {
    id: '8',
    songTitle: 'Macorina',
    correctArtist: 'Los Panchos',
    options: ['Los Panchos', 'Los Tres Ases', 'Los Dandys'],
    decade: '1950',
    hint: 'Trío de boleros legendario'
  },
  {
    id: '9',
    songTitle: 'Que Bonito Amor',
    correctArtist: 'Amalia Mendoza',
    options: ['Amalia Mendoza', 'Lucha Reyes', 'Lola Beltrán'],
    decade: '1960',
    hint: 'La Tariácuri'
  },
  {
    id: '10',
    songTitle: 'Si Nos Dejan',
    correctArtist: 'José Alfredo Jiménez',
    options: ['José Alfredo Jiménez', 'Pedro Infante', 'Javier Solís'],
    decade: '1960',
    hint: 'El Rey de la música ranchera'
  }
];
