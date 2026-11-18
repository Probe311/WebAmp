# Ibanez Tube Screamer Mini (TSMINI) — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `ibanez-tube-screamer-mini`

---

## 1. Présentation

Version compacte du Tube Screamer (environ moitié de la taille d'un TS9). Même famille sonore mid-hump / soft clip, commandes Overdrive / Tone / Level, **true bypass**, alim externe 9 V uniquement (pas de pile). Made in Japan.

---

## 2. Sources

- https://www.ibanez.com/usa/products/detail/ts_mini_01.html
- Manuel TSMINI (Hoshino) — fichier local si téléchargé
- Référence croisée : documentation TS9 du même repo

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Overdrive, Tone, Level |
| Bypass | True bypass |
| Conso | 18 mA @ 9 V |
| Alim | DC 9 V centre négatif (externe) |

---

## 4. Technologie sonore

- Soft clipping diodes dans feedback (famille TS)
- Bosse médium caractéristique
- True bypass (différent du buffer JFET historique TS808)

---

## 5–6. Architecture / DSP

```text
Entrée → Soft clip mid-hump (DRIVE) → TONE → LEVEL → Sortie
(Réutiliser calibrage TS9, ajuster niveau/bypass)
```

Objectif DSP : temps réel, paramètres continus sans clics, calibration sur pédale physique, OS sur non-linéarités si besoin.

---

## 7–11. Calibration, tests, limites

- Mesurer FR, I/O, dynamique, latence
- A/B à niveau égal
- Identifier la révision matérielle avant calibration
- Documents et marques soumis aux droits applicables

---

## 12. Ressources locales

Voir les fichiers téléchargés dans ce dossier (photos, manuels, schémas).

---

## 13. Conclusion

Prioriser un modèle comportemental calibré avant une simulation circuit détaillée.
