# Electro-Harmonix Oceans 11 — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `electro-harmonix-oceans-11`

---

## 1. Présentation

Reverb multi-modes numérique EHX (mal taguée chorus dans l'app). 11 algorithmes (Hall, Spring, Plate, Reverse, etc.), Time, Tone, Reverb.

---

## 2. Sources

- ehx.com/products/oceans-11
- Manuel Oceans 11

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type réel | Reverb multi-mode |
| Modes | 11 algorithmes |

---

## 4. Technologie sonore

- DSP EHX reverb

---

## 5–6. Architecture / DSP

```text
Entrée → reverb(mode, Time, Tone) → mix
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
