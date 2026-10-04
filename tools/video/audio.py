import numpy as np, wave
SR=44100; DUR=10.0; N=int(SR*DUR); BPM=120; B=60/BPM
t=np.arange(N)/SR
rng=np.random.default_rng(1)
def env(x,a=0.002,d=0.1): return np.minimum(x/a,1)*np.exp(-x/d)
def sq(f,x,duty=0.5): return np.sign(np.sin(2*np.pi*f*x)-np.cos(np.pi*duty*1.0)+0.0)
def tri(f,x): return 2*np.abs(2*((f*x)%1)-1)-1
mix=np.zeros(N)
def add(start,sig,gain=1.0):
    i=int(start*SR); n=min(len(sig),N-i)
    if n>0: mix[i:i+n]+=sig[:n]*gain
def note(m): return 440*2**((m-69)/12)
# kick (every beat, from 0.0), snare on 2&4, hats on 8ths
kt=np.arange(int(0.25*SR))/SR
kick=np.sin(2*np.pi*(55*kt+ 90*(1-np.exp(-kt*30))/30))*np.exp(-kt*14)
st=np.arange(int(0.18*SR))/SR
snare=(rng.uniform(-1,1,len(st))*np.exp(-st*28)*0.7+np.sin(2*np.pi*190*st)*np.exp(-st*30)*0.4)
ht=np.arange(int(0.05*SR))/SR
hat=rng.uniform(-1,1,len(ht))*np.exp(-ht*90)
for k in range(int(DUR/B)):
    s=k*B
    if s>=7.5-1e-6 or s<7.0:  # drums out during riser
        add(s,kick,0.9)
        if k%2==1: add(s,snare,0.55)
        add(s+B/2,hat,0.25)
        if k%2==1: add(s,hat,0.2)
# bass: square, A minor pattern, 8ths
bass=[33,33,45,33,36,36,48,36,31,31,43,31,34,34,46,34]  # A1 A1 A2.. C.. G.. Bb (goofy)
for i in range(int(DUR/(B/2))):
    s=i*B/2
    if 7.0<=s<7.5: continue
    m=bass[(i//2)%len(bass)] if False else bass[i%len(bass)]
    x=np.arange(int(B/2*SR))/SR
    add(s,sq(note(m),x,0.25)*env(x,0.002,0.25),0.22)
# lead: dumb little 8-bit melody, 16ths arps/notes on a loop of 2 bars
mel=[69,0,72,0,76,0,72,0, 74,0,77,0,81,0,77,0]  # per 8th
for i in range(int(DUR/(B/2))):
    s=i*B/2
    if s<1.0 or 7.0<=s<7.5: continue
    m=mel[i%len(mel)]
    if m==0: continue
    x=np.arange(int(B/2*SR))/SR
    add(s,sq(note(m),x,0.125)*env(x,0.002,0.18),0.12)
# gulp / hit sfx at text hits
def hit(s,f0=420):
    x=np.arange(int(0.35*SR))/SR
    f=f0*np.exp(-x*7)+70
    ph=2*np.pi*np.cumsum(f)/SR
    sig=np.sign(np.sin(ph))*np.exp(-x*9)
    sig+=rng.uniform(-1,1,len(x))*np.exp(-x*40)*0.6
    add(s,sig,0.4)
for s in (2.0,3.5,5.0,6.0): hit(s)
# intro scream stab at 0
x=np.arange(int(0.5*SR))/SR
f=300+700*np.exp(-x*5)
sig=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*np.exp(-x*6)
sig+=rng.uniform(-1,1,len(x))*np.exp(-x*20)*0.7
add(0.0,sig,0.35)
# riser 6.5-7.5 : noise + rising square
rx=np.arange(int(1.0*SR))/SR
rf=200+2200*rx**2
rs=np.sign(np.sin(2*np.pi*np.cumsum(rf)/SR))*(rx**1.5)*0.35+rng.uniform(-1,1,len(rx))*(rx**2)*0.3
add(6.5,rs,0.6)
# big boom + chord at 7.5
bx=np.arange(int(1.4*SR))/SR
boom=np.sin(2*np.pi*(40*bx+60*(1-np.exp(-bx*20))/20))*np.exp(-bx*3.5)
add(7.5,boom,1.1)
add(7.5,rng.uniform(-1,1,len(bx))*np.exp(-bx*12)*0.6,0.5)
for m in (57,60,64,69):
    cx=np.arange(int(1.2*SR))/SR
    add(7.5,sq(note(m),cx,0.5)*np.exp(-cx*2.5)*0.5,0.12)
# outro jingle 8.6-10: goofy descending notes
out=[76,74,72,69,67,64]
for i,m in enumerate(out):
    s=8.6+i*0.2; ox=np.arange(int(0.25*SR))/SR
    add(s,sq(note(m),ox,0.25)*env(ox,0.002,0.12),0.22)
# master: fade out, limiter
fade=np.clip((DUR-t)/0.6,0,1); mix*=fade
mix=np.tanh(mix*1.3)
mix/=np.max(np.abs(mix))/0.89
pcm=(mix*32767).astype(np.int16)
with wave.open('out/audio.wav','wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('audio ok')
