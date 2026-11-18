/**
 * Batch asset fetch for pedals missing local files.
 * node _fetch_assets.mjs
 */
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let next = res.headers.location;
        if (!next.startsWith('http')) next = `${parsed.protocol}//${parsed.host}${next}`;
        return download(next, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
      file.on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// folder -> list of [url, filename]
const jobs = {
  Dunlop_Fuzz_Face: [
    ['https://www.jimdunlop.com/fuzz-face/', 'page.html'],
    ['https://www.hobby-hour.com/electronics/s/schematics/dallas-arbiter-fuzz-face-schematic.png', 'schema.png'],
  ],
  ZVEX_Fuzz_Factory: [
    ['https://www.zvex.com/fuzz-factory', 'page.html'],
  ],
  Electro_Harmonix_Big_Muff: [], // skip wrong key
  'Electro-Harmonix_Big_Muff': [
    ['https://www.ehx.com/products/big-muff-pi/', 'page.html'],
    ['https://www.ehx.com/wp-content/uploads/2020/10/usbm-f.jpg', 'photo.jpg'],
  ],
  'Electro-Harmonix_Electric_Mistress': [
    ['https://www.ehx.com/products/electric-mistress/', 'page.html'],
  ],
  'Electro-Harmonix_Oceans_11': [
    ['https://www.ehx.com/products/oceans-11/', 'page.html'],
  ],
  'Electro-Harmonix_Small_Stone': [
    ['https://www.ehx.com/products/small-stone/', 'page.html'],
  ],
  BOSS_CE_1: [],
  'BOSS_CE-1': [
    ['https://www.hobby-hour.com/electronics/s/schematics/boss-ce1-chorus-schematic.png', 'schema.png'],
    ['https://www.boss.info/global/products/ce-1/', 'page.html'],
  ],
  'BOSS_PH-3': [
    ['https://www.boss.info/global/products/ph-3/', 'page.html'],
    ['https://static.roland.com/assets/media/pdf/PH-3_e2.pdf', 'manuel.pdf'],
  ],
  'BOSS_Volume_Expression': [
    ['https://www.boss.info/global/products/fv-50h/', 'page.html'],
  ],
  Dunlop_Cry_Baby: [
    ['https://www.jimdunlop.com/cry-baby/', 'page.html'],
    ['https://www.hobby-hour.com/electronics/s/schematics/dunlop-crybaby-gcb95-schematic.png', 'schema.png'],
  ],
  Dunlop_Cry_Baby_Wah: [
    ['https://www.jimdunlop.com/cry-baby/', 'page.html'],
  ],
  Dunlop_Slash_SW95: [
    ['https://www.jimdunlop.com/slash-cry-baby-classic-wah-sw95/', 'page.html'],
  ],
  Dunlop_KH95_Wah: [
    ['https://www.jimdunlop.com/kirk-hammett-cry-baby-wah-kh95/', 'page.html'],
  ],
  EVH_Signature_Wah: [
    ['https://www.jimdunlop.com/evh-wah/', 'page.html'],
  ],
  Vox_V847_Wah: [
    ['https://www.voxamps.com/product/v847-a/', 'page.html'],
    ['https://www.hobby-hour.com/electronics/s/schematics/vox-v847-wah-schematic.png', 'schema.png'],
  ],
  Morley_Bad_Horsie_Wah: [
    ['https://www.morleyelectronics.com/bad-horsie-wah.html', 'page.html'],
  ],
  RMC_Custom_Wah: [
    ['https://www.rmcwah.com/', 'page.html'],
  ],
  MXR_Phase_90: [
    ['https://www.jimdunlop.com/mxr-phase-90/', 'page.html'],
  ],
  MXR_Analog_Chorus: [
    ['https://www.jimdunlop.com/mxr-analog-chorus/', 'page.html'],
  ],
  MXR_Dyna_Comp: [
    ['https://www.jimdunlop.com/mxr-dyna-comp/', 'page.html'],
    ['https://www.hobby-hour.com/electronics/s/schematics/mxr-dynacomp-schematic.png', 'schema.png'],
  ],
  'MXR_10-Band_EQ': [
    ['https://www.jimdunlop.com/mxr-ten-band-eq/', 'page.html'],
  ],
  MXR_Flanger_117: [
    ['https://www.jimdunlop.com/mxr-flanger/', 'page.html'],
  ],
  'MXR_MC-402_Boost_OD': [
    ['https://www.jimdunlop.com/mxr-custom-audio-electronics-mc-401-boost/', 'page.html'],
  ],
  TC_Electronic_Flashback: [
    ['https://www.tcelectronic.com/product.html?modelCode=P0DEE', 'page.html'],
  ],
  'TC_Electronic_G-Major_2': [
    ['https://www.tcelectronic.com/product.html?modelCode=P0CBA', 'page.html'],
  ],
  TC_Electronic_2290_Style: [
    ['https://www.tcelectronic.com/', 'page.html'],
  ],
  Strymon_Timeline: [
    ['https://www.strymon.net/products/timeline/', 'page.html'],
  ],
  Strymon_BigSky: [
    ['https://www.strymon.net/products/bigsky/', 'page.html'],
  ],
  Strymon_BigSky_Shimmer: [
    ['https://www.strymon.net/products/bigsky/', 'page.html'],
  ],
  Strymon_Flint: [
    ['https://www.strymon.net/products/flint/', 'page.html'],
  ],
  Strymon_El_Capistan: [
    ['https://www.strymon.net/products/el-capistan/', 'page.html'],
  ],
  Fulltone_Supatrem: [
    ['https://www.fulltoneusa.com/products/supatrem', 'page.html'],
  ],
  DigiTech_Whammy: [
    ['https://www.digitech.com/products/whammy/', 'page.html'],
  ],
  Moog_MF_Ring: [
    ['https://www.moogmusic.com/products/minifoogers/mf-ring', 'page.html'],
  ],
  Red_Panda_Bitmap: [
    ['https://www.redpandalab.com/products/bitmap-2', 'page.html'],
  ],
  'Z_Vex_Lo-Fi_Junky': [
    ['https://www.zvex.com/lo-fi-junky', 'page.html'],
  ],
  SurfyBear_Metal: [
    ['https://www.surfybear.com/', 'page.html'],
  ],
  Neunaber_Ambient: [
    ['https://neunaber.net/products/immerse-reverberator-mk-ii', 'page.html'],
  ],
  Empress_ParaEQ: [
    ['https://empresseffects.com/products/paraeq-mkii', 'page.html'],
  ],
  Source_Audio_Programmable_EQ: [
    ['https://www.sourceaudio.net/programmable-eq.html', 'page.html'],
  ],
  ISP_Decimator: [
    ['https://www.isptechnologies.com/product/decimator-ii-noise-reduction-pedal/', 'page.html'],
  ],
  'Roger_Mayer_Octavia': [
    ['https://www.roger-mayer.co.uk/classic.htm', 'page.html'],
  ],
  'Shin-ei_Uni-Vibe': [
    ['https://www.hobby-hour.com/electronics/s/schematics/shin-ei-univibe-schematic.png', 'schema.png'],
  ],
  Colorsound_Power_Booster: [
    ['https://www.hobby-hour.com/electronics/s/schematics/colorsound-powerboost-schematic.png', 'schema.png'],
  ],
  Maestro_Echoplex: [
    ['https://www.hobby-hour.com/electronics/s/schematics/maestro-ep3-echoplex-schematic.png', 'schema.png'],
  ],
  Roland_Space_Echo: [
    ['https://www.roland.com/global/products/re-201/', 'page.html'],
  ],
  Binson_Echorec: [
    ['https://en.wikipedia.org/wiki/Binson_Echorec', 'page_wiki.html'],
  ],
  'Mooer_E-Lady': [
    ['https://www.mooeraudio.com/product/E-Lady-37.html', 'page.html'],
  ],
  Mooer_Phase_90: [
    ['https://www.mooeraudio.com/', 'page.html'],
  ],
  Eventide_Harmonizer: [
    ['https://www.eventideaudio.com/rackmount/h910-harmonizer/', 'page.html'],
  ],
  Leslie_Rotary_Simulator: [
    ['https://en.wikipedia.org/wiki/Leslie_speaker', 'page_wiki.html'],
  ],
  Custom_Clean_Boost: [
    ['https://www.hobby-hour.com/electronics/s/schematics/mxr-microamp-schematic.png', 'schema_microamp_ref.png'],
  ],
  Custom_Killswitch: [
    ['https://en.wikipedia.org/wiki/Effects_unit', 'page_wiki.html'],
  ],
  Vox_Time_Machine: [
    ['https://www.voxshowroom.com/us/misc/satriani.html', 'page.html'],
    ['https://www.voxshowroom.com/ct/misc/satriani/VOX_JSDL_TIME_MACHINE_OM.pdf', 'manuel.pdf'],
  ],
  Walrus_Audio_Fundamental_Ambient: [
    ['https://www.walrusaudio.com/products/fundamental-ambient', 'page.html'],
  ],
  Walrus_Audio_Fundamental_Flanger: [
    ['https://www.walrusaudio.com/products/fundamental-series-flanger', 'page.html'],
  ],
};

async function main() {
  let ok = 0, fail = 0;
  for (const [folder, list] of Object.entries(jobs)) {
    if (!list.length) continue;
    for (const [url, name] of list) {
      const dest = path.join(root, folder, name);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
        console.log('skip', folder + '/' + name);
        continue;
      }
      try {
        await download(url, dest);
        const sz = fs.statSync(dest).size;
        if (sz < 200) throw new Error('too small ' + sz);
        console.log('OK', folder + '/' + name, sz);
        ok++;
      } catch (e) {
        console.log('FAIL', folder + '/' + name, e.message);
        try { fs.unlinkSync(dest); } catch {}
        fail++;
      }
    }
  }
  console.log(`DONE ok=${ok} fail=${fail}`);
}

main();
