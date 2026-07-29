import type { Character } from '../types';
import { imageMap } from '../config/imageMap';

export function Header({ music, onMusic }: { count: number; characters: Character[]; music: boolean; onMusic: () => void }) {
  return <header>
    <div className="brand">
      <img src={imageMap.usagiAnimated} alt="烏薩琪" />
      <div><strong>SHIYO 的生日禮物</strong><small>birthday surprise</small></div>
    </div>
    <div className="header-right">
      <button className="sound-button" onClick={onMusic} aria-label={music ? '開啟音效' : '關閉音效'} aria-pressed={music}>
        {music ? '🔇' : '♫'}
      </button>
    </div>
  </header>;
}
