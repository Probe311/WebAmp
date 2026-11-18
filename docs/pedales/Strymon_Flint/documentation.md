# Strymon Flint — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `strymon-flint`

---

## 1. Présentation

Tremolo + reverb Strymon (3 trem × 3 reverb). Intensity Speed Mix pour chaque section.

---

## 2. Sources

- strymon.net/flint
- Manuel Flint

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Sections | Tremolo + Reverb |

---

## 4. Technologie sonore

- Trem 60s/65/photocell
- Reverb spring/plate/hall

---

## 5–6. Architecture / DSP

```text
trem → reverb (order)
```

Objectif : temps réel, multi-instances, calibration sur matériel réel, suréchantillonnage des non-linéarités si nécessaire.

---

## 7–11. Calibration, tests, limites

- Captures DI, FR, I/O, écoute A/B
- Identifier la révision matérielle
- Sans pédale physique, la fidélité reste une approximation
- Schémas et marques soumis aux droits applicables

---

## 12. Ressources locales

Compléter ce dossier avec photos produit, manuels PDF et schémas (script `download.js`).

---

## 13. Conclusion

Modèle comportemental calibré en priorité ; raffiner selon mesures.
