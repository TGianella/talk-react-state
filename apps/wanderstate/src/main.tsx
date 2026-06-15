import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CURRENT_CHAPTER } from './current-chapter'
import { Ch1aApp }  from './chapters/ch1a'
import { Ch1bApp }  from './chapters/ch1b'
import { Ch2App }   from './chapters/ch2'
import { Ch3aApp }  from './chapters/ch3a'
import { Ch3cApp }  from './chapters/ch3c'
import { Ch4bApp }  from './chapters/ch4b'
import { Ch5aApp }  from './chapters/ch5a'
import './index.css'

const apps = {
  '1a': Ch1aApp,
  '1b': Ch1bApp,
  '2':  Ch2App,
  '3a': Ch3aApp,
  '3c': Ch3cApp,
  '4b': Ch4bApp,
  '5a': Ch5aApp,
} as const

const CurrentApp = apps[CURRENT_CHAPTER]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrentApp />
  </StrictMode>,
)
