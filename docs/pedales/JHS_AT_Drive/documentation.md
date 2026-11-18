# JHS AT / AT+ (Andy Timmons Drive) — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `jhs-at-drive`

---

## 1. Présentation

Overdrive signature Andy Timmons (évolution Angry Charlie). Canal drive : Volume, Drive, EQ, Air, toggle 25/50/100 W. AT+ ajoute un boost indépendant footswitchable. 9–18 V.

---

## 2. Sources

- https://jhspedals.info/products/at
- Manuel JHS AT+
- Build docs / schémas réplique (fichiers locaux)

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes drive | Volume, Drive, EQ, Air, toggle 25/50/100 W |
| AT+ | Boost indépendant + 2 footswitches |
| Alim | 9–18 V DC centre négatif |
| Conso | ~15 mA |

---

## 4. Technologie sonore

- Voicing British amp-in-a-box / Angry Charlie family
- 25 W = plus compressé ; 100 W = plus ouvert (diode lift)
- EQ = HPF / bright-dark ; Air = présence
- Boost AT+ = pré-boost légèrement dirty

---

## 5–6. Architecture / DSP

```text
Entrée → [Boost?] → Drive + clip(mode W) → EQ/Air → Volume → Sortie
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
