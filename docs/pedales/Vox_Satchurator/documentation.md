# Vox Satchurator (JSDS) — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `satchurator`

**Objectif :** documenter la distorsion signature Joe Satriani (Vox) pour émulation WebAmp.

---

## 1. Présentation

**Vox Satchurator (JSDS)** — collaboration Joe Satriani / Vox (~2009). Point de départ : vintage **BOSS DS-1** japonaise, avec extras : gain élevé plus musical, préservation des aigus au volume guitare, pad d’entrée, footswitch **MORE** (boost de gain).

Commandes : **Gain**, **Tone**, **Volume** + switch pad + **MORE**.

**Principe :** hard-clip type DS-1 + tone passif type matrice + mode MORE — réutiliser le modèle DS-1 puis calibrer écarts.

---

## 2. Sources

- Manuel : [`manuel_Satchurator.pdf`](./manuel_Satchurator.pdf) — https://www.voxshowroom.com/ct/misc/satriani/VOX_JSDS_SATCHURATOR_OM.pdf
- Contexte : https://www.voxshowroom.com/us/misc/satriani.html
- Analyses mods : Planet Z (tone matrix passive, diodes 1N914, MORE = gain)

Pas de schéma service officiel public fiable.

---

## 3. Caractéristiques

| | |
|---|---|
| Type | Distorsion analogique |
| Zin / Zout | 470 kΩ / 10 kΩ |
| Conso | 24 mA |
| Dimensions | 143 × 121 × 58 mm |
| Poids | 600 g (sans pile) |
| Alim | 9 V pile ou adaptateur |

---

## 4. Technologie

- Base sonore DS-1 (hard clip diodes)
- Tone : matrice passive (scoop / tilt), perte de niveau possible
- MORE : boost de gain (pas forcément de volume)
- Pad d’entrée pour signaux déjà hot
- Dynamique / touch-sensitive revendiquée

---

## 5–6. Architecture / DSP

```text
Entrée → [Pad] → Gain (+ MORE) → Clip diodes → Tone matrix → Volume → Sortie
```

DSP : chaîne DS-1 calibrée + param MORE (gain) + pad (−dB) + tone matrix 1 knob.

---

## 7–13. Calibration & conclusion

Comparer à DS-1 et à Satchurator physique. Priorité : clip, tone matrix, MORE, loudness limitée post-diodes.

## Ressources

| Fichier | |
|---|---|
| [`manuel_Satchurator.pdf`](./manuel_Satchurator.pdf) | Owner’s manual |
