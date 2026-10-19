"""Download the inventory sprites documented by Minecraft Wiki, without redrawing.

The archive preserves the Wiki's Invicon files; block infobox renders are not used.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
from io import BytesIO
from PIL import Image
import hashlib
import json

ROOT = Path(__file__).parent
DEST = ROOT / 'dist' / 'assets'
BASE = 'https://wiki.ronlab.site/content/minecraftwiki_en_all_maxi_2025-11/_assets_/5af80496508534f4cdd561aac15bbc50/'
ICONS = {
    'respawn_anchor': 'Respawn Anchor',
    'enchanting_table': 'Enchanting Table',
    'command_block': 'Command Block',
    'slime_block': 'Slime Block',
    'sculk_sensor': 'Sculk Sensor',
    'ender_chest': 'Ender Chest',
    'beacon': 'Beacon',
    'elytra': 'Elytra',
    'shulker_box': 'Shulker Box',
    'totem_of_undying': 'Totem of Undying',
    'netherite_pickaxe': 'Netherite Pickaxe',
    'conduit': 'Conduit',
    'diamond_sword': 'Diamond Sword',
    'invisibility_potion': 'Potion of Invisibility',
    'ender_pearl': 'Ender Pearl',
    'wind_charge': 'Wind Charge',
}

def fetch(pair):
    item_id, title = pair
    extension = '.gif' if item_id in ['command_block', 'sculk_sensor'] else '.png'
    filename = 'Invicon_' + title.replace(' ', '_') + extension
    url = BASE + quote(filename)
    data = urlopen(Request(url, headers={'User-Agent': 'MCTI inventory asset verification'}), timeout=35).read()
    # Kiwix stores some PNG URLs as WebP. Decode without resizing or repainting.
    # Animated inventory textures use their first frame for the static result card.
    with Image.open(BytesIO(data)) as source:
        source.seek(0)
        image = source.convert('RGBA')
        if image.width not in [16, 32] or image.height != image.width:
            raise ValueError(f'{item_id}: unexpected inventory sprite size {image.size}')
        if not image.getchannel('A').getbbox():
            raise ValueError(f'{item_id}: empty image')
        image.save(DEST / (item_id + '.png'))
    output = (DEST / (item_id + '.png')).read_bytes()
    return {'id': item_id, 'file': filename, 'archive_url': url,
            'original_url': 'https://minecraft.wiki/w/File:' + quote(filename),
            'source_sha256': hashlib.sha256(data).hexdigest(),
            'sha256': hashlib.sha256(output).hexdigest()}

if __name__ == '__main__':
    DEST.mkdir(parents=True, exist_ok=True)
    results = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [(item, pool.submit(fetch, (item, title))) for item, title in ICONS.items()]
        for item, future in futures:
            try:
                result = future.result()
                results.append(result)
                print(item, 'OK')
            except Exception as error:
                print(item, 'ERROR', error)
    if len(results) != len(ICONS):
        raise SystemExit('Some inventory sprites were not downloaded')
    (DEST / 'inventory-sources.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
