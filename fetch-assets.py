from pathlib import Path
from urllib.request import urlopen, Request
from concurrent.futures import ThreadPoolExecutor
from zipfile import ZipFile
from io import BytesIO
import json

dest=Path(__file__).parent/'dist'/'assets'
base='https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.21.4/assets/minecraft/textures/'
items=['elytra','totem_of_undying','netherite_pickaxe','diamond_sword','ender_pearl','wind_charge','potion','potion_overlay','conduit']
blocks=['respawn_anchor_top','respawn_anchor_side0','enchanting_table_top','enchanting_table_side','command_block_front','command_block_side','slime_block','sculk_sensor_top','sculk_sensor_side','beacon','purple_shulker_box','grass_block_top','dirt','stone','oak_log','oak_log_top','oak_leaves','obsidian','end_stone']
def get(url):
    return urlopen(Request(url,headers={'User-Agent':'MCTI-Site'}),timeout=45).read()
def download(spec):
    folder,name=spec
    try:
        output_name=name+'_texture' if name in ['slime_block','beacon'] else name
        if (dest/(output_name+'.png')).exists():return name+' cached'
        data=get(base+folder+'/'+name+'.png')
        (dest/(output_name+'.png')).write_bytes(data)
        return name+' OK'
    except Exception as e:return name+' ERROR '+str(e)
with ThreadPoolExecutor(max_workers=8) as pool:
    for result in pool.map(download,[('item',i) for i in items]+[('block',i) for i in blocks]+[('entity/chest','ender')]):print(result)
release=json.loads(get('https://api.github.com/repos/TakWolf/fusion-pixel-font/releases/latest'))
asset=next(a for a in release['assets'] if a['name'].startswith('fusion-pixel-font-12px-monospaced-otf.woff2-'))
with ZipFile(BytesIO(get(asset['browser_download_url']))) as z:
    print(z.namelist())
    name=next(n for n in z.namelist() if 'zh_hans' in n and n.endswith('.woff2'))
    (dest/'pixel.woff2').write_bytes(z.read(name))
    for name in z.namelist():
        if 'LICENSE' in name.upper() or 'OFL' in name.upper():
            license_path=dest/'licenses'/name
            license_path.parent.mkdir(parents=True,exist_ok=True)
            license_path.write_bytes(z.read(name))
print('pixel font OK')
