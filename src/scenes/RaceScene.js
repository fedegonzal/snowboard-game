import Phaser from 'phaser';
import { SCREEN, KEYS, RACE } from '../config.js';
import { generateTrack } from '../game/track.js';
import { Rider } from '../game/Rider.js';
import { toTenths, formatTime } from '../game/time.js';
import { addTime } from '../game/leaderboard.js';
import { THEME } from '../render/theme.js';
import { drawTrack } from '../render/trackView.js';
import { createRiderView } from '../render/riderView.js';
import { createHud } from '../render/hud.js';
import { createRiderSounds } from '../render/sounds.js';

const MAX_STEP_MS = 100; // evita saltos grandes si el navegador se detiene un momento
const GO_MESSAGE_MS = 700;

// data: { mode: 1 | 2, players: [{ name, helmet, jacket, board }] }
export class RaceScene extends Phaser.Scene {
  constructor() {
    super('RaceScene');
  }

  init(data) {
    this.mode = data.mode;
    this.playerConfigs = data.players;
  }

  create() {
    // Una sola pista por carrera, compartida por ambos participantes.
    this.track = generateTrack();
    this.riders = this.playerConfigs.map((cfg) => new Rider(cfg, this.track));

    drawTrack(this, this.track);
    this.riderViews = this.riders.map((r) => createRiderView(this, r));
    this.riderSounds = this.riders.map((r) => createRiderSounds(this, r));
    this.views = this.createViews();
    // En modo individual se juega con las flechas.
    const keySets = this.mode === 1 ? [KEYS[1]] : KEYS;
    this.inputs = keySets.map((keys) => this.input.keyboard.addKeys(keys));

    this.countdownMs = RACE.countdown * 1000;
    this.raceMs = 0;
    this.firstFinisher = null;
    this.ended = false;
    this.saving = false;
    for (let i = 0; i <= RACE.countdown; i++) {
      this.time.delayedCall(i * 1000, () => this.sound.play(i < RACE.countdown ? 'beep' : 'go'));
    }

    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }

  // Una cámara por participante (pantalla dividida en modo de dos personas), cada una con su HUD.
  createViews() {
    const split = this.riders.length > 1;
    const width = SCREEN.width / this.riders.length;
    const views = this.riders.map((rider, i) => {
      const cam = i === 0 ? this.cameras.main : this.cameras.add();
      cam.setViewport(i * width, 0, width, SCREEN.height);
      cam.setBackgroundColor(THEME.background);
      const hud = createHud(this, width, SCREEN.height, split ? { name: rider.name, jacket: rider.jacket } : {});
      if (split) {
        // Línea divisoria: media en cada vista, sobre el borde compartido.
        const line = this.add.rectangle(i === 0 ? width - 3 : 0, 0, 3, SCREEN.height, THEME.ink).setOrigin(0);
        line.setScrollFactor(0).setDepth(10000);
        hud.objects.push(line);
      }
      return { cam, hud };
    });
    for (const view of views) {
      for (const other of views) if (other !== view) view.cam.ignore(other.hud.objects);
    }
    return views;
  }

  update(time, delta) {
    if (this.countdownMs > 0) {
      this.countdownMs -= delta;
    } else if (!this.ended) {
      const step = Math.min(delta, MAX_STEP_MS);
      this.raceMs += step;
      this.riders.forEach((r, i) => r.update(step / 1000, this.readInput(i), this.track, this.raceMs));
      this.checkFinish();
    }
    this.render(time);
  }

  readInput(i) {
    const keys = this.inputs[i];
    return {
      left: keys.left.isDown,
      right: keys.right.isDown,
      accelerate: keys.accelerate.isDown,
      jump: Phaser.Input.Keyboard.JustDown(keys.jump),
    };
  }

  checkFinish() {
    if (!this.firstFinisher) this.firstFinisher = this.riders.find((r) => r.finished) ?? null;
    if (this.riders.every((r) => r.finished)) {
      this.ended = true;
      this.time.delayedCall(RACE.endDelay * 1000, () => this.endRace());
    }
  }

  async endRace() {
    const results = this.riders.map((r) => ({ name: r.name, tenths: toTenths(r.finishMs) }));
    const result = { mode: this.mode, players: this.playerConfigs, results, topPosition: null, winner: null, saveError: false };
    if (this.mode === 2) {
      const [a, b] = results;
      result.winner = a.tenths === b.tenths ? 'tie' : a.tenths < b.tenths ? 0 : 1;
      this.scene.start('ResultScene', result);
      return;
    }
    this.saving = true;
    let left = false;
    this.events.once('shutdown', () => (left = true));
    try {
      result.topPosition = await addTime(results[0].name, results[0].tenths);
    } catch (err) {
      console.error(err);
      result.saveError = true;
    }
    if (left) return; // se volvió al menú mientras se guardaba
    // Si entró al top 10, se muestra la tabla antes del resultado.
    if (result.topPosition) this.scene.start('TopScene', { result });
    else this.scene.start('ResultScene', result);
  }

  render(time) {
    this.riders.forEach((rider, i) => {
      this.riderViews[i].update(time);
      this.riderSounds[i].update();
      const { cam, hud } = this.views[i];
      cam.scrollX = this.track.width / 2 - cam.width / 2;
      cam.scrollY = rider.y - cam.height * 0.3;
      const section = this.track.sections[rider.section];
      hud.update({
        sectionName: section.name,
        sectionColor: section.color,
        time: formatTime(toTenths(rider.finishMs ?? this.raceMs)),
        text: this.messageFor(rider),
      });
    });
  }

  messageFor(rider) {
    if (this.countdownMs > 0) return String(Math.ceil(this.countdownMs / 1000));
    if (this.raceMs < GO_MESSAGE_MS) return '¡Ya!';
    if (this.saving) return 'Guardando…';
    if (rider.finished) return `¡Llegada!\n${formatTime(toTenths(rider.finishMs))}`;
    if (rider.state === 'fallen') return '¡Caída!';
    if (this.firstFinisher) return `${this.firstFinisher.name}\nllegó primero`;
    return '';
  }
}
