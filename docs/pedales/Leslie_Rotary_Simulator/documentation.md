# Leslie Rotary Simulator — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `leslie-rotary`

---

## 1. Présentation

Simulation haut-parleur rotatif Leslie (horn + drum). Speed Slow/Fast/Brake.

---

## 2. Sources

- Leslie / Hammond docs
- Pédales rotary type Uni-Vibe/Leslie sim

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Rotary speaker sim |

---

## 4. Technologie sonore

- Doppler / AM-FM

---

## 5–6. Architecture / DSP

```text
dual rotor modulation
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
