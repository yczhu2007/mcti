from pathlib import Path
from PIL import Image, ImageDraw
import random

root=Path(__file__).parent/'dist'/'assets'
def texture(name,tint=None):
    im=Image.open(root/(name+'.png')).convert('RGBA').crop((0,0,16,16))
    if tint:
        px=im.load()
        for y in range(16):
            for x in range(16):
                r,g,b,a=px[x,y]; k=(r+g+b)/3/255
                px[x,y]=(*(int(c*k) for c in tint),a)
    return im
def cube(im,x,y,top,left=None,right=None):
    left=left or top;right=right or left
    d=ImageDraw.Draw(im)
    for face,tex,shade in [('l',left,.74),('r',right,.53),('t',top,1)]:
        for v in range(16):
            for u in range(16):
                c=tex.getpixel((u,v))
                if not c[3]:continue
                c=(*(int(i*shade) for i in c[:3]),c[3])
                if face=='t':p=(x+2*(u-v),y+u+v);a=(2,1);b=(-2,1)
                elif face=='l':p=(x-32+2*u,y+16+u+2*v);a=(2,1);b=(0,2)
                else:p=(x+2*u,y+32-u+2*v);a=(2,-1);b=(0,2)
                px,py=p
                d.polygon([p,(px+a[0],py+a[1]),(px+a[0]+b[0],py+a[1]+b[1]),(px+b[0],py+b[1])],fill=c)

# Chest textures used only within the decorative floating island.
uv=Image.open(root/'ender.png').convert('RGBA')
top=uv.crop((14,0,28,14)).resize((16,16),Image.Resampling.NEAREST)
front=Image.new('RGBA',(16,16));front.paste(uv.crop((14,14,28,19)).resize((16,5)),(0,0));front.paste(uv.crop((14,33,28,43)).resize((16,11)),(0,5))
ImageDraw.Draw(front).rectangle((7,4,9,9),fill='#a1a46c')

# Isometric voxel island. All geometry is generated, using local block textures.
scene=Image.new('RGBA',(760,660));grass=texture('grass_block_top',(140,190,87));dirt=texture('dirt');stone=texture('stone');leaves=texture('oak_leaves',(94,159,57));log=texture('oak_log');logtop=texture('oak_log_top')
random.seed(42)
cells=[]
for a in range(8):
    for b in range(8):
        if (a-3.5)**2+(b-3.5)**2<19:
            cells.append((a,b,random.choice([2,2,2,3])))
def pos(a,b,z=0):return (380+(a-b)*32,230+(a+b)*16-z*32)
for a,b,h in sorted(cells,key=lambda c:c[0]+c[1]):
    for z in range(h):
        x,y=pos(a,b,z);cube(scene,x,y,grass if z==h-1 else stone,dirt if z==h-1 else stone)
# Tree made of clustered leaf cubes.
for z in range(3,6):
    x,y=pos(2,2,z);cube(scene,x,y,logtop,log)
for layer,positions in [(6,[(a,b) for a in range(1,4) for b in range(1,4)]),(7,[(1,2),(2,1),(2,2),(2,3),(3,2)]),(8,[(2,2)])]:
    for a,b in sorted(positions,key=lambda p:sum(p)):
        x,y=pos(a,b,layer);cube(scene,x,y,leaves)
# A tiny portal and a chest on the island.
obsidian=texture('obsidian')
for z in range(3,7):
    for a in [5,7]:
        x,y=pos(a,2,z);cube(scene,x,y,obsidian)
for a in [5,6,7]:
    x,y=pos(a,2,7);cube(scene,x,y,obsidian)
for z in [4,5,6]:
    x,y=pos(6,2,z)
    ImageDraw.Draw(scene).polygon([(x-24,y+10),(x+23,y+33),(x+23,y+62),(x-24,y+39)],fill='#9257bc')
    for j in range(5):
        px=x+random.randint(-20,17);py=y+random.randint(24,40)
        ImageDraw.Draw(scene).rectangle((px,py,px+4,py+3),fill='#bd7ce1')
x,y=pos(5,5,3);cube(scene,x,y,top,front,front)
# Grass tufts, small flowers and torch.
d=ImageDraw.Draw(scene)
for a,b in [(1,4),(4,6),(6,4),(3,5)]:
    x,y=pos(a,b,3);d.line([(x,y+8),(x,y-7)],fill='#729e44',width=3);d.line([(x,y+6),(x-6,y-1)],fill='#729e44',width=3)
for a,b in [(3,6),(6,5)]:
    x,y=pos(a,b,3);d.line([(x,y+5),(x,y-9)],fill='#7b9d4f',width=3);d.rectangle((x-4,y-15,x+4,y-8),fill='#eee1a3')
scene=scene.crop((90,0,680,530));scene.save(root/'island.png')
print('Floating island rendered')
