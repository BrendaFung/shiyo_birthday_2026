import { motion } from 'framer-motion';
import { PaperTexture } from './PaperTexture';
import { imageMap } from '../config/imageMap';

export function Opening({ onStart }: { onStart: () => void }) {
  return <main className="opening page"><PaperTexture />
    <motion.div className="opening-banner" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><img src={imageMap.openingBanner} alt="烏薩琪生日快樂" /></motion.div>
    <motion.div className="opening-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }}>
      <p className="eyebrow">一份提早寄出的心意 · 2026</p>
      <h1>Happy Birthday <em>SHIYO</em> <span>🎂</span></h1>
      <p className="lead opening-blessing"><span>提早一個月的祝福！🎉</span><span>做好準備開始試試手氣啦～</span><span>希望接下來的一年都能歐皇附體，</span><span>驚喜、好運通通被你抽到！🍀✨</span></p>
      <button className="primary-button" onClick={onStart}>開始戳戳樂 <span>→</span></button>
      <p className="tiny-note">made with lots of love & tiny stars</p>
    </motion.div>
  </main>;
}
