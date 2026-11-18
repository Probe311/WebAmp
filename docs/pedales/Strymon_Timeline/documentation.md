# Strymon Timeline — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `strymon-timeline`

---

## 1. Présentation

Delay rack-in-a-box Strymon : nombreux machines (dTape, dBucket, Dual, Ice…), MIDI, looper, knobs Value/Time/Repeats/Mix/Filter/Grit/Speed/Depth.

---

## 2. Sources

- strymon.net/timeline
- Manuel Timeline PDF

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Multi-delay DSP |
| MIDI | Oui |

---

## 4. Technologie sonore

- Machines delay haute fidélité

---

## 5–6. Architecture / DSP

```text
machine(type) multi-param
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
