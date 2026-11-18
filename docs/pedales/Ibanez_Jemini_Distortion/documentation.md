# Ibanez Jemini Distortion — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `ibanez-jemini`

**Objectif :** documenter le Jemini (Steve Vai) — double circuit OD + Dist — pour émulation WebAmp.

---

## 1. Présentation

Pédale signature **Steve Vai** (Ibanez / Hoshino, ~2008) : **deux circuits indépendants** (overdrive type TS9 modifié + distorsion type DS-1 modifiée). Un seul circuit actif à la fois (bascule footswitch). Boîtier zinc multicolore, LEDs autour des knobs (modes BRIGHT / SAVE).

Chaque côté : **DRIVE**, **TONE**, **LEVEL**.

**Principe :** émuler **deux chaînes** (TS soft-clip mid-hump + DS hard-clip) + commutation exclusive, pas un seul mode générique.

---

## 2. Sources

- Manuel officiel : [`manuel_JEMINI.pdf`](./manuel_JEMINI.pdf) — https://www.hoshinogakki.co.jp/pdf/ibanez/manual/en/electronics/JEMINI.pdf
- Communauté : freestompboxes / Madbean — topology TS9 + DS-1 modifiés ; Ibanez a fourni un schéma à certains demandeurs (discontinué)

> Schéma constructeur non redistribué ici. S’appuyer sur mesures + connaissances TS9/DS-1 déjà documentées dans ce repo.

---

## 3. Caractéristiques

| | |
|---|---|
| Type | Dual OD / Distortion |
| Alim | 9 V pile ou AC109/309/509 |
| Conso | 23 mA (SAVE) / 49 mA (BRIGHT) |
| Dimensions | 140 × 170 × 58 mm |
| Poids | 880 g (avec pile) |
| AOP typique (dist) | RC4558 (rapports communauté) |

---

## 4. Technologie sonore

- **Côté OD** : soft clip / mid-hump (famille Tube Screamer, tweaks Vai)
- **Côté Dist** : hard clip type DS-1 / Keeley Seeing Eye–like (Vai)
- Filtres distincts par côté (ordre de grandeur communauté : BP ~86–116 Hz OD ; ~85 Hz / 1,5 kHz Dist)
- Commutation exclusive OD ↔ Dist

---

## 5–6. Architecture / DSP

```text
Entrée → Buffer
  ├─ Chaîne OD (DRIVE/TONE/LEVEL)   ┐
  └─ Chaîne Dist (DRIVE/TONE/LEVEL) ┴─ sélecteur exclusif → Buffer → Sortie
```

DSP : deux instances (réutiliser modèles TS9 + DS-1 calibrés), switch dry/wet exclusif, trim de niveau entre côtés.

---

## 7–11. Calibration, tests, limites

Mesurer chaque côté séparément. Pas de schéma public stable → incertitude composants. Droits sur docs Ibanez.

---

## 12. Ressources locales

| Fichier | |
|---|---|
| [`manuel_JEMINI.pdf`](./manuel_JEMINI.pdf) | Manuel constructeur |

---

## 13. Conclusion

Priorité : dual-path TS-like + DS-like + exclusive switch. Réutiliser calibrages TS9/DS-1 puis ajuster sur Jemini physique.
