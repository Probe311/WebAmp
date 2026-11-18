# Mesa/Boogie Grid Slammer — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `mesa-grid-slammer`

---

## 1. Présentation

Overdrive Mesa avec bosse médium « 70s », plage Gain du soft clip au high-gain bas, Level jusqu'à ~+20 dB pour « slammer » l'entrée d'ampli. True bypass. Fabriqué Petaluma, CA.

---

## 2. Sources

- Manuel officiel Mesa Grid Slammer PDF
- https://www.mesaboogie.com/ (fiche produit)
- Build docs / schémas réplique DIY (fichiers locaux)

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Gain, Tone, Level |
| Bypass | True bypass |
| Boost Level | jusqu’à ~+20 dB |
| Alim | 9 V centre négatif / pile |
| Conso | ~15 mA (fiche) |

---

## 4. Technologie sonore

- Mid bump classique guitare
- Gain bas = rythme / blues percussif
- Gain haut = legato / lead crémeux
- Usage « input slamming » vers préampli amp

---

## 5–6. Architecture / DSP

```text
Entrée → Gain (soft→sat) + mid bump → Tone → Level → Sortie
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
