import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { VoiceProvider } from '../context/VoiceContext';

import { useState, useEffect } from 'react';
import { voiceService } from './data/voiceService';


import { VoiceButton } from './components/VoiceButton';


function App() {
  return (
    <VoiceProvider>
      <RouterProvider router={router} />
      <VoiceButton />
    </VoiceProvider>
  );
}

export default App;