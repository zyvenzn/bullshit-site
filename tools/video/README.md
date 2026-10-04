# Video / image generator

Makes the BULLSHIT posts (animated bull + 8-bit music). Run everything from the repo root.

Needs: python3, numpy, opencv-python, pillow, ffmpeg, DejaVu fonts (Linux path in lib.py/make3.py; change if missing).

    mkdir -p out
    python3 tools/video/audio.py                    # out/audio.wav (10s music + sfx)
    ffmpeg -y -i out/audio.wav -t 6 -af "afade=t=out:st=5.3:d=0.7" out/audio6.wav
    python3 tools/video/make2.py                    # out/bullshit_post_v2.mp4 (intro video, 10s)
    python3 tools/video/make3.py                    # out/day{2..5}_{image.png,video.mp4}

To make a new post: copy `draw_day()` in make3.py, add a `day==N` branch with the text events.
Text events land on 0.5s, 2.0s, 3.5s, 5.0s so they hit the sound effects.
Source art lives in /brand. Do not add a contract address or buy link to any video until the token is live.
