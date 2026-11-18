# Electro-Harmonix Memory Man — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `memory-man-delay`

---

## 1. Présentation

Delay analogique BBD + modulation (chorus/vibrato). Blend, Delay, Feedback, Depth/Rate selon version (Deluxe, etc.).

---

## 2. Sources

- ehx.com Memory Man
- Schémas MN3005

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Analog BBD delay |
| Mod | Oui |

---

## 4. Technologie sonore

- Dark repeats
- Mod chorus

---

## 5–6. Architecture / DSP

```text
BBD delay + LFO mod + mix
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
