# Walrus Audio Fundamental Delay — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `walrus-audio-delay`

---

## 1. Présentation

Delay Fundamental : Time, Feedback, Mix + 3 modes (Digital / Analog / Reverse).

---

## 2. Sources

- walrusaudio.com Fundamental Delay
- Manuel EN

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Modes | Digital, Analog, Reverse |
| Time max | ~1 s (manuel) |

---

## 4. Technologie sonore

- Trails / caractère selon mode

---

## 5–6. Architecture / DSP

```text
delay(mode) → mix
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
