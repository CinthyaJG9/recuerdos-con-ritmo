import { createBrowserRouter } from 'react-router';
import { Welcome } from './pages/Welcome';
import { GameMenu } from './pages/GameMenu';
import { SongSelection } from './pages/SongSelection';
import { GameTypeSelection } from './pages/GameTypeSelection';
import { CompleteLyrics } from './pages/CompleteLyrics';
import { SessionSummary } from './pages/SessionSummary';
import { ArtistQuizInstructions } from './pages/ArtistQuizInstructions';
import { ArtistQuizPlay } from './pages/ArtistQuizPlay';
import { ArtistQuizResults } from './pages/ArtistQuizResults';
import { ProverbsInstructions } from './pages/ProverbsInstructions';
import { ProverbsPlay } from './pages/ProverbsPlay';
import { ProverbsResults } from './pages/ProverbsResults';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Welcome,
  },
  {
    path: '/menu',
    Component: GameMenu,
  },
  {
    path: '/songs',
    Component: SongSelection,
  },
  {
    path: '/game-type/:songId',
    Component: GameTypeSelection,
  },
  {
    path: '/game/:songId/:gameType',
    Component: CompleteLyrics,
  },
  {
    path: '/summary',
    Component: SessionSummary,
  },
  {
    path: '/artist-quiz/instructions',
    Component: ArtistQuizInstructions,
  },
  {
    path: '/artist-quiz/play',
    Component: ArtistQuizPlay,
  },
  {
    path: '/artist-quiz/results',
    Component: ArtistQuizResults,
  },
  {
    path: '/proverbs/instructions',
    Component: ProverbsInstructions,
  },
  {
    path: '/proverbs/play',
    Component: ProverbsPlay,
  },
  {
    path: '/proverbs/results',
    Component: ProverbsResults,
  },
]);