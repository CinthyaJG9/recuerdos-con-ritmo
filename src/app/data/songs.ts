export interface Song {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: 'ranchera' | 'bolero' | 'balada';
  lyrics: {
    fragment: string;
    missing: string;
    options: string[];
    hint: string;
  }[];
}

export const songs: Song[] = [
  {
    id: '1',
    title: 'Cucurrucucú Paloma',
    artist: 'Tomás Méndez',
    year: '1954',
    genre: 'ranchera',
    lyrics: [
      {
        fragment: 'Dicen que por las noches no más se le iba en puro _____',
        missing: 'llorar',
        options: ['llorar', 'cantar', 'soñar'],
        hint: 'Una expresión de tristeza'
      },
      {
        fragment: 'Dicen que no comía, no más se le iba en puro _____',
        missing: 'tomar',
        options: ['tomar', 'bailar', 'pensar'],
        hint: 'Acompañaba su tristeza con bebida'
      },
      {
        fragment: 'Juran que el mismo _____ con sus trinos se le iba',
        missing: 'cielo',
        options: ['cielo', 'viento', 'tiempo'],
        hint: 'Lo que está arriba de nosotros'
      },
      {
        fragment: 'Ay, ay, ay, ay, ay _____ como lloraba',
        missing: 'cantaba',
        options: ['cantaba', 'gritaba', 'sufría'],
        hint: 'Expresar melodía con la voz'
      },
      {
        fragment: 'Cucurrucucú paloma, cucurrucucú no _____',
        missing: 'llores',
        options: ['llores', 'cantes', 'vueles'],
        hint: 'Lo opuesto a reír'
      }
    ]
  },
  {
    id: '2',
    title: 'Bésame Mucho',
    artist: 'Consuelo Velázquez',
    year: '1940',
    genre: 'bolero',
    lyrics: [
      {
        fragment: 'Bésame, bésame _____',
        missing: 'mucho',
        options: ['mucho', 'siempre', 'ahora'],
        hint: 'Una gran cantidad'
      },
      {
        fragment: 'Como si fuera esta noche la última _____',
        missing: 'vez',
        options: ['vez', 'noche', 'hora'],
        hint: 'Ocasión o momento'
      },
      {
        fragment: 'Bésame mucho, que tengo _____ perderte',
        missing: 'miedo',
        options: ['miedo', 'ganas', 'prisa'],
        hint: 'Sentimiento de temor'
      },
      {
        fragment: 'Perderte después y _____',
        missing: 'otra vez',
        options: ['otra vez', 'nunca más', 'para siempre'],
        hint: 'De nuevo'
      },
      {
        fragment: 'Quiero tenerte muy cerca, mirarme en tus _____',
        missing: 'ojos',
        options: ['ojos', 'brazos', 'labios'],
        hint: 'Con ellos vemos'
      }
    ]
  },
  {
    id: '3',
    title: 'La Barca',
    artist: 'Roberto Cantoral',
    year: '1968',
    genre: 'balada',
    lyrics: [
      {
        fragment: 'Dicen que la distancia es el _____',
        missing: 'olvido',
        options: ['olvido', 'destino', 'camino'],
        hint: 'Dejar de recordar'
      },
      {
        fragment: 'Pero yo no concibo esa _____',
        missing: 'razón',
        options: ['razón', 'canción', 'ilusión'],
        hint: 'Motivo o explicación'
      },
      {
        fragment: 'Pues yo seguiré siendo el _____',
        missing: 'cautivo',
        options: ['cautivo', 'testigo', 'marino'],
        hint: 'Quien está preso o atrapado'
      },
      {
        fragment: 'De los caprichos de tu _____',
        missing: 'corazón',
        options: ['corazón', 'amor', 'pasión'],
        hint: 'Órgano que late en el pecho'
      },
      {
        fragment: 'Navegar por aguas _____',
        missing: 'turbias',
        options: ['turbias', 'claras', 'profundas'],
        hint: 'No son claras ni transparentes'
      }
    ]
  },
  {
    id: '4',
    title: 'Amor Eterno',
    artist: 'Juan Gabriel',
    year: '1984',
    genre: 'ranchera',
    lyrics: [
      {
        fragment: 'Tú eres la tristeza de mis _____',
        missing: 'ojos',
        options: ['ojos', 'días', 'noches'],
        hint: 'Con ellos miramos'
      },
      {
        fragment: 'Que lloran en _____ por tu amor',
        missing: 'silencio',
        options: ['silencio', 'secreto', 'la noche'],
        hint: 'Ausencia de ruido'
      },
      {
        fragment: 'Me miro en el espejo y veo en mi rostro el _____ que me dejó',
        missing: 'tiempo',
        options: ['tiempo', 'dolor', 'recuerdo'],
        hint: 'Los años que pasan'
      },
      {
        fragment: 'Yo sé que en el _____ allá en el cielo, un día nos vamos a encontrar',
        missing: 'cielo',
        options: ['cielo', 'tiempo', 'destino'],
        hint: 'Lugar espiritual arriba'
      },
      {
        fragment: 'Amor _____, e inolvidable',
        missing: 'eterno',
        options: ['eterno', 'sincero', 'profundo'],
        hint: 'Que dura para siempre'
      }
    ]
  },
  {
    id: '5',
    title: 'El Reloj',
    artist: 'Roberto Cantoral',
    year: '1956',
    genre: 'bolero',
    lyrics: [
      {
        fragment: 'Reloj, no marques las _____',
        missing: 'horas',
        options: ['horas', 'noches', 'vidas'],
        hint: 'Unidades de tiempo de 60 minutos'
      },
      {
        fragment: 'Porque voy a _____',
        missing: 'enloquecer',
        options: ['enloquecer', 'llorar', 'morir'],
        hint: 'Perder la razón'
      },
      {
        fragment: 'Ella se irá para _____',
        missing: 'siempre',
        options: ['siempre', 'nunca', 'mañana'],
        hint: 'Por toda la eternidad'
      },
      {
        fragment: 'Cuando amanezca otra _____',
        missing: 'vez',
        options: ['vez', 'noche', 'mañana'],
        hint: 'Ocasión'
      },
      {
        fragment: 'No más nos queda esta _____',
        missing: 'noche',
        options: ['noche', 'hora', 'vida'],
        hint: 'Periodo de oscuridad'
      }
    ]
  },
  {
    id: '6',
    title: 'Somos Novios',
    artist: 'Armando Manzanero',
    year: '1968',
    genre: 'bolero',
    lyrics: [
      {
        fragment: 'Somos novios, pues los dos sentimos mutuo _____',
        missing: 'amor',
        options: ['amor', 'dolor', 'temor'],
        hint: 'Sentimiento de cariño profundo'
      },
      {
        fragment: 'Somos novios, manteniendo un _____ muy puro',
        missing: 'noviazgo',
        options: ['noviazgo', 'romance', 'cariño'],
        hint: 'Relación entre dos personas que se aman'
      },
      {
        fragment: 'Nos amamos, nos besamos como _____',
        missing: 'novios',
        options: ['novios', 'amantes', 'esposos'],
        hint: 'Pareja que tiene un compromiso'
      },
      {
        fragment: 'Vivimos _____ los dos',
        missing: 'enamorados',
        options: ['enamorados', 'felices', 'unidos'],
        hint: 'Estado de quien siente amor'
      },
      {
        fragment: 'Somos novios, siempre _____',
        missing: 'novios',
        options: ['novios', 'juntos', 'unidos'],
        hint: 'Lo que somos'
      }
    ]
  }
];
