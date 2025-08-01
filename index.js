
import React from 'react';
import { createRoot } from 'react-dom/client';
import AdvancedGeopoliticalSimulation from './enhanced-geopolitical-sim.tsx';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<AdvancedGeopoliticalSimulation />);
