import './MusicButton.css';

export default function MusicButton({ playing, onToggle }) {
  return (
    <button
      className="music"
      type="button"
      aria-pressed={playing}
      aria-label={playing ? 'Pause music' : 'Play music'}
      onClick={onToggle}
    >
      <i />
      <i />
      <i />
    </button>
  );
}
