import './app.css'
import MusicPlayer from './components/MusicPlayer.svelte'

// 挂载点
const targetId = 'hexo-music-player-root';
let target = document.getElementById(targetId);

if (!target) {
    target = document.createElement('div');
    target.id = targetId;
    document.body.appendChild(target);
}

const app = new MusicPlayer({
    target: target,
})

export default app
