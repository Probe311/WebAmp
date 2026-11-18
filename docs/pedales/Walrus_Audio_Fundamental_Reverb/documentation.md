# Walrus Audio Fundamental Reverb — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `walrus-audio-reverb`

---

## 1. Présentation

Reverb Fundamental : Decay, Tone, Mix + modes (Hall / Plate / Spring).

---

## 2. Sources

- walrusaudio.com Fundamental Reverb

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Modes | Hall, Plate, Spring |

---

## 4. Technologie sonore

- Trois algorithmes

---

## 5–6. Architecture / DSP

```text
reverb(mode)
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
