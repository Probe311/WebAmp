# Maestro Echoplex (EP-3) — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `echoplex-tape-delay`

---

## 1. Présentation

Delay à bande mythique. EP-3 = circuit à transistors, wow/flutter, saturation bande. Contrôles Echo Delay, Sustain, Volume.

---

## 2. Sources

- Schémas EP-3 service
- Manuels Maestro

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Tape echo |
| Réf. | EP-3 |

---

## 4. Technologie sonore

- Wow/flutter
- Saturation bande
- Feedback Sustain

---

## 5–6. Architecture / DSP

```text
delay modulé + sat + noise optionnel
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
