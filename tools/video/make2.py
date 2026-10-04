import numpy as np, cv2, subprocess, math, random
from PIL import Image, ImageDraw, ImageFont
W=H=1080; FPS=30; N=300; BPM=120; B=60/BPM
src=cv2.cvtColor(cv2.imread('brand/bull-original.png'),cv2.COLOR_BGR2RGB)
S=src.shape[0]
RED=(255,42,61); BONE=(241,232,214); BG=(10,6,5)
gy,gx=np.mgrid[0:S,0:S].astype(np.float32)
def bump(cx,cy,rx,ry):
    d=((gx-cx)/rx)**2+((gy-cy)/ry)**2
    return np.clip(1-d,0,1)**0.6
M_EYE_L=bump(515,617,100,100); M_EYE_R=bump(978,650,56,56)
M_JAW=bump(850,1010,210,200)
# roll feather mask (box 540..880 x 80..380)
M_ROLL=np.clip(1-(((gx-710)/190)**2+((gy-225)/190)**2),0,1)**0.5
def F(sz,mono=False):
    p='/usr/share/fonts/truetype/dejavu/'
    return ImageFont.truetype(p+('DejaVuSansMono-Bold.ttf' if mono else 'DejaVuSansCondensed-Bold.ttf'),sz)
def clamp(x,a=0,b=1): return max(a,min(b,x))
def ease(t): t=clamp(t); return 1-(1-t)**3

def bull_frame(t,f,pulse,shake):
    mx=np.zeros((S,S),np.float32); my=np.zeros((S,S),np.float32)
    # eyes (crazy, out of sync)
    mx+=M_EYE_L*(40*math.sin(t*3.1)+10*math.sin(t*9)); my+=M_EYE_L*(24*math.cos(t*2.3))
    mx+=M_EYE_R*(22*math.sin(t*4.0+1)); my+=M_EYE_R*(14*math.cos(t*3.3+2))
    # chewing jaw
    chew=0.5+0.5*math.sin(t*2*math.pi*2.0)
    my+=M_JAW*(46*chew+30*pulse)
    # toilet roll sway about its base
    th=math.radians(6*math.sin(t*2*math.pi*1.0)+5*pulse)
    cx,cy=710,370
    dx=gx-cx; dy=gy-cy
    rx=math.cos(th)*dx+math.sin(th)*dy; ry=-math.sin(th)*dx+math.cos(th)*dy
    mx+=M_ROLL*(rx-dx); my+=M_ROLL*(ry-dy)
    # global bob / breathing / beat zoom
    zoom=1.0+0.015*math.sin(t*2)+0.05*pulse
    ox=6*math.sin(t*1.7)+shake[0]; oy=14*math.sin(t*2*math.pi*1.0)+shake[1]
    ang=math.radians(1.2*math.sin(t*1.3))
    Mm=cv2.getRotationMatrix2D((S/2,S/2),math.degrees(ang),zoom); Mm[0,2]+=ox; Mm[1,2]+=oy
    warped=cv2.remap(src,gx-mx,gy-my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REFLECT)
    out=cv2.warpAffine(warped,Mm,(S,S),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REFLECT)
    return cv2.resize(out,(W,H),interpolation=cv2.INTER_AREA)

yy=np.arange(H)[:,None]
scan=(1-0.2*((yy%4)<1)).astype(np.float32)[:,:,None]
xx=np.linspace(-1,1,W)[None,:]; yv=np.linspace(-1,1,H)[:,None]
vig=(1-0.4*np.clip(xx**2+yv**2,0,1.6)).astype(np.float32)[:,:,None]
rr=random.Random(5)
# falling candles overlay at edges
CANDLES=[(rr.choice([rr.randrange(10,230),rr.randrange(850,1050)]),rr.uniform(0.5,1.4),rr.randrange(60,220),rr.random()*1100,rr.random()<0.12) for _ in range(16)]
def overlay(a,t,pulse):
    im=Image.fromarray(a); d=ImageDraw.Draw(im,'RGBA')
    for (x,sp,h,off,g) in CANDLES:
        y=((off+t*300*sp)%(H+h+200))-h-100
        col=(55,224,122,150) if g else (255,42,61,170)
        d.rectangle([x,y,x+24,y+h],fill=col); d.rectangle([x+11,y-30,x+13,y+h+30],fill=col)
    return np.asarray(im)

def post(a,glitch,f,flash=0.0):
    a=a.astype(np.float32)
    if glitch>0:
        s=int(20*glitch)
        a[:,:,0]=np.roll(a[:,:,0],s,axis=1); a[:,:,2]=np.roll(a[:,:,2],-s,axis=1)
        for _ in range(int(2+9*glitch)):
            y=rr.randrange(0,H-40); h=rr.randrange(8,70); dx=rr.randrange(-100,100)
            a[y:y+h]=np.roll(a[y:y+h],dx,axis=1)
    a=a*scan*vig
    a[:,:,0]+=40*max(0,pulse_g[0])
    a+=np.random.default_rng(f).normal(0,5,a.shape).astype(np.float32)
    if flash>0: a=a*(1-flash)+255*flash
    return np.clip(a,0,255).astype(np.uint8)
pulse_g=[0.0]

def caption(a,text,col,age,y=930,size=150):
    im=Image.fromarray(a); d=ImageDraw.Draw(im)
    k=ease(age/0.14); s=1+0.7*(1-k)
    fnt=F(int(size*s*0.62))
    d.text((W//2,y),text,font=fnt,fill=col,stroke_width=10,stroke_fill=BG,anchor='mm')
    return np.asarray(im)

HITS=[(2.0,'NO UTILITY.',BONE),(3.5,'JUST BULLSHIT.',RED),(5.0,'STAY STUPID.',BONE),(6.0,'STAY BULLISH.',RED)]
def render(f):
    t=f/FPS
    ph=(t%B)/B
    pulse=math.exp(-ph*7) if t>0.01 else 1.0
    pulse_g[0]=pulse*0.5
    rs=np.random.default_rng(f)
    sh=(rs.uniform(-1,1)*10*pulse,rs.uniform(-1,1)*10*pulse)
    base=bull_frame(t,f,pulse,sh)
    glitch=0.0; flash=0.0
    if t<0.5: glitch=0.9*(1-t/0.5); flash=max(0,1-t/0.12)
    for hs,_,_ in HITS:
        if 0<=t-hs<0.15: glitch=max(glitch,0.7*(1-(t-hs)/0.15))
    if t>=6.5: base=overlay(base,t,pulse)
    else: base=overlay(base,t,pulse)
    if t<7.5:
        for hs,txt,col in HITS:
            if hs<=t<hs+1.4: base=caption(base,txt,col,t-hs)
        if 7.0<=t<7.5:  # riser: heavy glitch building
            glitch=max(glitch,(t-7.0)/0.5*0.9)
        return post(base,glitch,f,flash)
    # end card
    te=t-7.5
    if te<0.1: flash=1-te/0.1
    canvas=Image.new('RGB',(W,H),BG)
    s=640; small=Image.fromarray(base).resize((s,s),Image.LANCZOS)
    d=ImageDraw.Draw(canvas); x=(W-s)//2; y=50
    d.rectangle([x-8+14,y-8+14,x+s+8+14,y+s+8+14],fill=(140,15,29)); d.rectangle([x-8,y-8,x+s+8,y+s+8],fill=BONE)
    canvas.paste(small,(x,y))
    k=ease(te/0.25); sc=1+0.5*(1-k)
    d.text((W//2,830),'$BULLSHIT',font=F(int(160*sc)),fill=RED,stroke_width=10,stroke_fill=BG,anchor='mm')
    if te>0.4: d.text((W//2,935),'NO UTILITY. JUST BULLSHIT.',font=F(56),fill=BONE,stroke_width=6,stroke_fill=BG,anchor='mm')
    if te>0.7: d.text((W//2,1012),'@BullShit_Solana',font=F(46,True),fill=BONE,stroke_width=4,stroke_fill=BG,anchor='mm')
    if te>1.0: d.text((W//2,1055),'meme token. not financial advice.',font=F(24,True),fill=(190,180,165),anchor='mm')
    return post(np.asarray(canvas),0.25 if (f%31)<2 else 0,f,flash)

p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
 '-i','out/audio.wav','-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-preset','medium','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart','out/bullshit_post_v2.mp4'],stdin=subprocess.PIPE)
for f in range(N):
    fr=render(f)
    if f in (3,45,70,110,160,200,235,270): Image.fromarray(fr).save(f'out/g{f}.png')
    p.stdin.write(fr.tobytes())
p.stdin.close(); p.wait(); print('done')
