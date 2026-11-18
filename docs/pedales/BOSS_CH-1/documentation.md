# BOSS CH-1 Super Chorus — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `boss-ch1`

---

## 1. Présentation

Chorus analogique BOSS à BBD, contrôles Rate, Depth, EQ, Level. Voicing plus « moderne » / brillant que CE-2.

---

## 2. Sources

- boss.info/products/ch-1
- Service Notes CH-1 / CH-1A synfo

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | E.LEVEL, EQ, RATE, DEPTH |
| Circuit | BBD analogique |

---

## 4. Technologie sonore

- Chorus stéréo effect via EQ et depth
- Bypass bufferisé BOSS

---

## 5–6. Architecture / DSP

```text
Dry + delay modulé (LFO Rate/Depth) → EQ → mix Level
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
