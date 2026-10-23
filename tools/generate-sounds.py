# Sintetiza los efectos de sonido del juego en public/assets/sounds/ (WAV mono de 16 bits).
# Uso: python3 tools/generate-sounds.py
import math
import random
import struct
import wave
from pathlib import Path

RATE = 22050
OUT = Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'sounds'
random.seed(7)


def samples(dur):
    return range(int(dur * RATE))


def tone(freq, dur, decay=8.0, harmonics=(1.0, 0.3, 0.1)):
    # Nota con armónicos y caída exponencial; freq puede ser función del tiempo (barrido).
    f = freq if callable(freq) else (lambda t: freq)
    out, phase = [], 0.0
    for i in samples(dur):
        t = i / RATE
        phase += 2 * math.pi * f(t) / RATE
        attack = min(1.0, t / 0.005)
        out.append(attack * math.exp(-decay * t) * sum(a * math.sin((k + 1) * phase) for k, a in enumerate(harmonics)))
    return out


def noise(dur):
    return [random.uniform(-1, 1) for _ in samples(dur)]


def lowpass(signal, cutoff):
    # Filtro de un polo; cutoff puede ser función del tiempo.
    c = cutoff if callable(cutoff) else (lambda t: cutoff)
    out, y = [], 0.0
    for i, x in enumerate(signal):
        a = 1 - math.exp(-2 * math.pi * c(i / RATE) / RATE)
        y += a * (x - y)
        out.append(y)
    return out


def envelope(signal, fn):
    return [x * fn(i / RATE) for i, x in enumerate(signal)]


def mix(*signals):
    n = max(len(s) for s in signals)
    return [sum(s[i] for s in signals if i < len(s)) for i in range(n)]


def at(start, signal):
    return [0.0] * int(start * RATE) + signal


def sequence(notes, step, **kw):
    return mix(*(at(i * step, tone(f, d, **kw)) for i, (f, d) in enumerate(notes)))


def seamless(signal, fade):
    # Funde el final con el principio para que el loop no tenga corte.
    n = int(fade * RATE)
    body = signal[:-n]
    for i in range(n):
        w = i / n
        body[i] = body[i] * w + signal[len(signal) - n + i] * (1 - w)
    return body


def save(name, signal, peak=0.8):
    scale = peak / max(abs(x) for x in signal)
    with wave.open(str(OUT / f'{name}.wav'), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes(b''.join(struct.pack('<h', int(x * scale * 32767)) for x in signal))


C5, E5, G5, C6, E6, G6 = 523.25, 659.25, 783.99, 1046.5, 1318.5, 1568.0

# Tabla sobre la nieve: ruido filtrado con un vaivén suave (2 ciclos por loop).
hiss = noise(2.2)
snow = [h - l for h, l in zip(lowpass(hiss, 2500), lowpass(hiss, 400))]
snow = envelope(snow, lambda t: 0.75 + 0.25 * math.sin(2 * math.pi * t))
OUT.mkdir(parents=True, exist_ok=True)
save('slide', seamless(snow, 0.2), peak=0.6)

save('crash', mix(
    tone(lambda t: 140 * math.exp(-4 * t) + 35, 0.6, decay=6, harmonics=(1.0, 0.5)),
    envelope(lowpass(noise(0.6), 1200), lambda t: 0.8 * math.exp(-9 * t)),
))
save('jump', mix(
    envelope(lowpass(noise(0.35), lambda t: 600 + 5000 * t), lambda t: math.sin(math.pi * t / 0.35)),
    tone(lambda t: 300 + 900 * t, 0.35, decay=6, harmonics=(0.25,)),
), peak=0.5)
save('beep', tone(660, 0.18, decay=12, harmonics=(1.0, 0.0, 0.25)), peak=0.5)
save('go', tone(990, 0.45, decay=6, harmonics=(1.0, 0.0, 0.25)), peak=0.6)
save('section', sequence([(E6, 0.5), (G6, 0.7)], 0.09, decay=6), peak=0.5)
save('finish', sequence([(C5, 0.3), (E5, 0.3), (G5, 0.3), (C6, 0.8)], 0.1, decay=5, harmonics=(1.0, 0.0, 0.11)))
save('win', sequence([(G5 / 2, 0.25), (C5, 0.25), (E5, 0.25), (G5, 0.4), (E5, 0.2), (G5, 1.2)], 0.14,
                     decay=3, harmonics=(1.0, 0.0, 0.11)))
save('select', tone(1200, 0.06, decay=40, harmonics=(1.0,)), peak=0.35)
save('confirm', sequence([(800, 0.08), (1200, 0.12)], 0.06, decay=25, harmonics=(1.0, 0.2)), peak=0.4)
