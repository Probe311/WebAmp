# BOSS CE-2 Chorus — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `boss-ce2`

---

## 1. Présentation

Chorus compact classique Rate/Depth, BBD MN3007/MN3207 selon révision. Son warm référence.

---

## 2. Sources

- Service Notes CE-2 synfo
- hobby-hour schematic

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Rate, Depth |
| Circuit | BBD |

---

## 4. Technologie sonore

- Chorus mono warm

---

## 5–6. Architecture / DSP

```text
Dry + BBD LFO
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
