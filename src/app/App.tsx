import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { VoiceProvider } from '../context/VoiceContext';

import { useState, useEffect } from 'react';
import { voiceService } from './data/voiceService';


function App() {
  return (
    <VoiceProvider>
      <RouterProvider router={router} />
    </VoiceProvider>
  );
}

export default App;