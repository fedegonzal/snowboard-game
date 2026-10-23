import { RIDER, BOARDS } from '../config.js';
import { sectionIndexAt } from './track.js';

// Lógica de un participante, independiente de Phaser y de cómo se dibuje.
// x: centro horizontal; y: posición en el descenso (crece hacia la meta).
export class Rider {
  constructor({ name, helmet, jacket, board }, track) {
    this.name = name;
    this.helmet = helmet;
    this.jacket = jacket;
    this.board = BOARDS[board];
    this.x = track.width / 2;
    this.y = track.startY;
    this.state = 'riding'; // riding | fallen | finished
    this.speed = 0;
    this.stopRate = null; // desaceleración fijada al soltar el acelerador
    this.section = 0;
    this.jumpLeft = 0;
    this.fallLeft = 0;
    this.immuneLeft = 0;
    this.ignored = null; // obstáculo que causó la última caída
    this.finishMs = null;
  }

  get jumping() {
    return this.jumpLeft > 0;
  }

  get immune() {
    return this.immuneLeft > 0;
  }

  get finished() {
    return this.state === 'finished';
  }

  // dt en segundos; input: { left, right, accelerate, jump }; raceMs: tiempo de carrera actual.
  update(dt, input, track, raceMs) {
    if (this.state === 'finished') return;

    if (this.state === 'fallen') {
      this.updateFallen(dt, track);
      return;
    }

    this.immuneLeft = Math.max(0, this.immuneLeft - dt);
    this.jumpLeft = Math.max(0, this.jumpLeft - dt);
    if (input.jump && !this.jumping) this.jumpLeft = RIDER.jumpDuration;

    this.section = sectionIndexAt(track, this.y);
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const max = track.sections[this.section].speed * this.board.speed * RIDER.maxBoost;
    if (input.accelerate) {
      this.stopRate = null;
      this.speed = Math.min(max, this.speed + (max / RIDER.accelTime) * dt);
    } else {
      this.stopRate ??= this.speed / RIDER.stopTime;
      this.speed = Math.max(0, this.speed - this.stopRate * dt);
    }

    this.y += this.speed * (dir !== 0 ? RIDER.turnFactor : 1) * dt;
    this.x += dir * RIDER.lateralSpeed * this.board.lateral * dt;

    this.checkEdges(track);
    if (this.state === 'riding') this.checkObstacles(track);

    if (this.y >= track.finishY) {
      this.state = 'finished';
      this.speed = 0;
      this.finishMs = raceMs;
    }
  }

  updateFallen(dt, track) {
    this.speed = 0;
    this.fallLeft -= dt;
    if (this.fallLeft > 0) return;
    // Se levanta en el mismo punto, apenas separado del borde si cayó contra él.
    const half = RIDER.size / 2 + RIDER.edgeNudge;
    this.x = Math.min(Math.max(this.x, half), track.width - half);
    this.state = 'riding';
    this.immuneLeft = RIDER.immunityDuration;
  }

  checkEdges(track) {
    const min = RIDER.size / 2;
    const max = track.width - RIDER.size / 2;
    if (this.x > min && this.x < max) return;
    this.x = Math.min(Math.max(this.x, min), max);
    if (!this.immune) this.fall(null);
  }

  checkObstacles(track) {
    if (this.ignored && !this.overlaps(this.ignored)) this.ignored = null;
    if (this.immune) return;
    const hit = track.obstacles.find(
      (o) => o !== this.ignored && !(o.low && this.jumping) && this.overlaps(o),
    );
    if (hit) this.fall(hit);
  }

  fall(obstacle) {
    this.state = 'fallen';
    this.fallLeft = RIDER.fallDuration;
    this.jumpLeft = 0;
    this.speed = 0;
    this.ignored = obstacle;
  }

  overlaps(o) {
    const half = RIDER.size / 2;
    return this.x + half > o.x && this.x - half < o.x + o.w && this.y + half > o.y && this.y - half < o.y + o.h;
  }
}
