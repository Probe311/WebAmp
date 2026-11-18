# Walrus Audio Fundamental Drive — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `walrus-audio-drive`

---

## 1. Présentation

Overdrive série Fundamental : 3 faders (Gain, Tone, Volume) + switch 3 modes de clipping. Discontinué côté boutique mais pertinent pour l'app.

---

## 2. Sources

- https://www.walrusaudio.com/products/fundamental-series-drive
- Manuel EN + Fundamental Start Guide (cdn Shopify Walrus)

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Gain, Tone, Volume |
| Modes | Smooth / Crunch / Bright |
| Bypass | True bypass |
| Alim | 9 V DC centre négatif, ≥ 100 mA |
| Taille | 4.33" × 2.16" × 1.61" |

---

## 4. Technologie sonore

- Smooth : soft clip Si classique
- Crunch : soft + hard clip Si + léger boost grave
- Bright : même clip que Crunch + coupe grave pré-clip
- Tone = réduction des aigus

---

## 5–6. Architecture / DSP

```text
Entrée → [HPF si Bright] → Gain → f_clip(mode) → Tone LPF → Volume → Sortie
```

Objectif DSP : temps réel, paramètres continus sans clics, calibration sur pédale physique, OS sur non-linéarités si besoin.

---

## 7–11. Calibration, tests, limites

- Mesurer FR, I/O, dynamique, latence
- A/B à niveau égal
- Pas de schéma public — calibrer les 3 courbes de clip
- Documents et marques soumis aux droits applicables

---

## 12. Ressources locales

Voir les fichiers téléchargés dans ce dossier (photos, manuels, schémas).

---

## 13. Conclusion

Prioriser un modèle comportemental calibré avant une simulation circuit détaillée.
