import sys, subprocess, math
sys.path.insert(0,'tools/video')
from lib import *
from PIL import Image, ImageDraw
DARK=(34,22,19)
FPS=30; DUR=6.0; NF=int(FPS*DUR); OUT='out/'
HITT=(2.0,3.5,5.0)

def panel(canvas,t,f,s,x,y,pulse=0.0,rot=0):
    b=bull_frame(t,f,pulse,(0,0))
    im=Image.fromarray(b).resize((s,s),Image.LANCZOS)
    d=ImageDraw.Draw(canvas)
    d.rectangle([x-8+12,y-8+12,x+s+8+12,y+s+8+12],fill=(140,15,29))
    d.rectangle([x-8,y-8,x+s+8,y+s+8],fill=BONE)
    canvas.paste(im,(x,y))

def pop(age,base=1.0):
    k=ease(age/0.12); return base*(1+0.5*(1-k))

def text(d,xy,s,size,col=BONE,anchor='mm',stroke=7,mono=False):
    d.text(xy,s,font=F(size,mono),fill=col,stroke_width=stroke,stroke_fill=BG,anchor=anchor)

def bubble(d,box,s,size,fill=BONE,fg=BG):
    x0,y0,x1,y1=box
    d.rounded_rectangle([x0+8,y0+8,x1+8,y1+8],radius=26,fill=(140,15,29))
    d.rounded_rectangle(box,radius=26,fill=fill,outline=BG,width=5)
    d.text(((x0+x1)//2,(y0+y1)//2),s,font=F(size),fill=fg,anchor='mm')

def vis(t,at,all_): return all_ or t>=at

def draw_day(day,t,f,all_):
    ph=(t%B)/B; pulse=math.exp(-ph*7)*0.6
    c=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(c)
    if day==2:
        panel(c,t,f,620,230,40,pulse)
        d=ImageDraw.Draw(c)
        if vis(t,0.5,all_): text(d,(W//2,740),'gm to everyone except',56)
        if vis(t,2.0,all_): text(d,(W//2,810),'people who say "accumulate."',56)
        if vis(t,3.5,all_): text(d,(W//2,885),"I don't know what that means.",50,(190,180,165))
        if vis(t,5.0,all_):
            s=int(110*pop(t-5.0) if not all_ else 110)
            text(d,(W//2,990),"I'm just a bull.",s,RED,stroke=9)
    elif day==3:
        if vis(t,0.5,all_): bubble(d,(40,50,1040,200),'analyst: bearish divergence on the 4H.',50)
        if vis(t,2.0,all_): bubble(d,(300,260,1020,380),'me: what is a 4H',54,fill=(255,200,205))
        panel(c,t,f,500,520,480,pulse); d=ImageDraw.Draw(c)
        if vis(t,3.5,all_): text(d,(280,700),'...',120,BONE)
        if vis(t,5.0,all_):
            s=int(125*pop(t-5.0) if not all_ else 125)
            text(d,(250,880),'bullish.',s,RED,stroke=10)
    elif day==4:
        items=['RSI','MACD','Fib levels','"Narrative rotation"','My own thesis']
        text(d,(60,70),"Things I don't understand:",54,RED,'lm')
        for i,it in enumerate(items):
            if vis(t,0.5+i*0.35,all_): text(d,(80,170+i*95),'x  '+it,62,BONE,'lm')
        panel(c,t,f,400,640,620,pulse); d=ImageDraw.Draw(c)
        if vis(t,3.2,all_): text(d,(60,720),'Things I do:',54,RED,'lm')
        if vis(t,5.0,all_):
            s=int(140*pop(t-5.0) if not all_ else 140)
            text(d,(60,860),'BULL.',s,BONE,'lm',stroke=10)
    elif day==5:
        panel(c,t,f,520,280,30,pulse); d=ImageDraw.Draw(c)
        steps=[(0.5,'Red candle.','Healthy correction.'),(2.0,'Red candle.','Still healthy.'),(3.5,'Red candle.','...')]
        if all_:
            for i,(_,a,b_) in enumerate(steps):
                text(d,(W//2,640+i*75),a+' '+b_,52,BONE)
            text(d,(W//2,930),'BULLSHIT.',170,RED,stroke=10)
        else:
            cur=None
            for st in steps:
                if t>=st[0]: cur=st
            if t<5.0 and cur:
                text(d,(W//2,700),cur[1],90,BONE); text(d,(W//2,820),cur[2],90,RED)
            elif t>=5.0:
                text(d,(W//2,780),'BULLSHIT.',int(190*pop(t-5.0)),RED,stroke=10)
        a=overlay(np.asarray(c),t,pulse); c=Image.fromarray(a)
    return np.asarray(c)

for day in (2,3,4,5):
    # image: still frame with all text visible
    fr=draw_day(day,2.3,69,True)
    Image.fromarray(post(fr,0.0,day)).save(f'{OUT}day{day}_image.png')
    p=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
      '-i',OUT+'audio6.wav','-c:v','libx264','-pix_fmt','yuv420p','-crf','21','-preset','medium','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart',f'{OUT}day{day}_video.mp4'],stdin=subprocess.PIPE)
    for f in range(NF):
        t=f/FPS
        fr=draw_day(day,t,f,False)
        g=0.0
        if t<0.3: g=0.8*(1-t/0.3)
        for h in HITT:
            if 0<=t-h<0.15: g=max(g,0.6*(1-(t-h)/0.15))
        pulse_g[0]=math.exp(-((t%B)/B)*7)*0.5
        out=post(fr,g,f,1.0-t/0.1 if t<0.1 else 0)
        if day==3 and f==int(4.2*FPS): Image.fromarray(out).save(f'{OUT}chk3.png')
        p.stdin.write(out.tobytes())
    p.stdin.close(); p.wait(); print('day',day,'ok')
