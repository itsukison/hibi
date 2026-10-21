import { createRoot } from 'react-dom/client';
import { SystemPage } from './SystemPage';
import '../styles/tokens.css';
import '../styles/components.css';
import './system.css';

createRoot(document.getElementById('root')!).render(<SystemPage />);
