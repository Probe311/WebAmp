# Walrus Audio Fundamental Tremolo — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `walrus-audio-tremolo`

---

## 1. Présentation

Tremolo Fundamental Rate/Depth/Volume + modes (opto / harmonic / random-like).

---

## 2. Sources

- walrusaudio.com Fundamental Tremolo

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Tremolo 3 modes |

---

## 4. Technologie sonore

- Voicings tremolo

---

## 5–6. Architecture / DSP

```text
trem(mode)
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
