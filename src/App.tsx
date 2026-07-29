import { useEffect, useState } from 'react';
import { Opening } from './components/Opening';
import { CardIntro } from './components/CardIntro';
import { Game } from './components/Game';
import { Complete } from './components/Complete';
import { useGameState } from './hooks/useGameState';
import { useSound } from './hooks/useSound';
import { characters, getCharacterSkill, getRoundForPrize, getSkillAutoRevealCount } from './config/gameConfig';
import { getPrizeSoundType } from './config/prizeSoundConfig';
import type { Character } from './types';
import prizes from './data/prizes.json';

type Reveal = {
  prizeId: number;
  prizeName: string;
  character: Character;
  blessing?: string;
  round?: 1 | 2;
};

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function App() {
  const game = useGameState();
  const sound = useSound(game.state.music);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [modalQueue, setModalQueue] = useState<Reveal[]>([]);
  const [skillMessage, setSkillMessage] = useState<{ title: string; message: string } | null>(null);
  const [pendingComplete, setPendingComplete] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .catch(() => undefined);
      if ('caches' in window) {
        caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).catch(() => undefined);
      }
    } else {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
        .then((registration) => registration.update())
        .catch(() => undefined);
    }
  }, []);

  const createReveal = (prizeId: number): Reveal => {
    const assignment = game.assignmentForPrize(prizeId);
    const characterId = game.characterForPrize(prizeId) ?? assignment?.characterId ?? characters[0].id;
    const character = characters.find((item) => item.id === characterId) ?? characters[0];
    return {
      prizeId,
      prizeName: prizes.find((prize) => prize.id === prizeId)?.name ?? `獎品${prizeId}`,
      character,
      blessing: assignment?.text,
      round: getRoundForPrize(prizeId),
    };
  };

  const open = (index: number) => {
    const id = game.openCell(index);
    if (id === undefined) return;
    sound.click();
    sound.paper();
    sound.prize(getPrizeSoundType(id));
    setPendingComplete(game.state.opened.length + 1 === 50);
    setReveal(createReveal(id));
  };

  const scrollToSkillCell = (cell: number) => {
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-cell-index="${cell}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    });
  };

  useEffect(() => {
    if (!reveal && modalQueue.length) {
      setReveal(modalQueue[0]);
      setModalQueue((queue) => queue.slice(1));
    }
  }, [reveal, modalQueue.length]);

  useEffect(() => {
    if (reveal) sound.modalOpen();
  }, [reveal]);

  useEffect(() => {
    if (reveal || modalQueue.length || game.state.skillInProgress || !game.state.skillQueue.length) return;
    const trigger = game.beginNextSkill();
    if (!trigger) return;
    const skill = getCharacterSkill(trigger.characterId);
    if (!skill) {
      game.finishSkill();
      return;
    }

    setSkillMessage({ title: skill.title, message: skill.message });

    (async () => {
      const skillReveals: Reveal[] = [];

      try {
        sound.skillAlert();
        await wait(120);
        sound.skill(trigger.characterId);
        for (let index = 0; index < getSkillAutoRevealCount(skill); index += 1) {
          await wait(720);
          const cell = game.randomUnopenedCell();
          if (cell === null) break;

          const prizeId = game.openCell(cell, true);
          if (prizeId === undefined) break;

          sound.paper();
          sound.prize(getPrizeSoundType(prizeId));
          scrollToSkillCell(cell);
          // Every prize opened by a skill is queued for a collection card.
          skillReveals.push(createReveal(prizeId));
        }
      } catch (error) {
        console.error('Skill reveal failed:', error);
      } finally {
        await wait(500);
        sound.chain(skillReveals.length);
        game.finishSkill();
        setSkillMessage(null);

        if (skillReveals.length) {
          // Show the first card immediately, then keep the rest strictly sequential.
          setReveal(skillReveals[0]);
          setModalQueue((queue) => [...queue, ...skillReveals.slice(1)]);
        }

        if (game.state.opened.length + skillReveals.length >= 50) {
          setPendingComplete(true);
        }
      }
    })();
  }, [game.state.skillQueue.length, game.state.skillInProgress, reveal, modalQueue.length]);

  useEffect(() => {
    if (!pendingComplete || reveal || modalQueue.length || game.state.skillInProgress || game.state.skillQueue.length || game.state.opened.length < 50) return;
    setPendingComplete(false);
    sound.win();
    game.finish();
  }, [pendingComplete, reveal, modalQueue.length, game.state.skillInProgress, game.state.skillQueue.length, game.state.opened.length]);

  const closeReveal = () => {
    sound.modalClose();
    setReveal(null);
    if (pendingComplete && !modalQueue.length && !game.state.skillQueue.length && !game.state.skillInProgress) {
      setPendingComplete(false);
      sound.win();
      game.finish();
    }
  };

  const restartToHome = () => {
    if (window.confirm('確定要重新開始嗎？目前的遊戲進度將會清除。')) game.restartToHome();
  };

  if (game.state.phase === 'opening') return <Opening onStart={() => { sound.click(); game.setPhase('card'); }} />;
  if (game.state.phase === 'card') return <CardIntro onStart={() => { sound.setMuted(false); sound.click(); game.restart(); }} />;
  if (game.state.phase === 'complete') return <Complete prizes={prizes} onRestart={restartToHome} />;

  const toggleAudio = () => {
    const nextMuted = !game.state.music;
    game.toggleMusic();
    sound.setMuted(nextMuted);
  };
  return <Game order={game.state.order} opened={game.state.opened} onOpen={open} count={game.state.opened.length} characters={characters} reveal={reveal} onCloseReveal={closeReveal} music={game.state.music} onMusic={toggleAudio} skillMessage={skillMessage} skillRunning={Boolean(skillMessage)} />;
}
