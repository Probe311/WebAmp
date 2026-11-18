# Dunlop / Dallas Arbiter Fuzz Face — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `dunlop-fuzz-face`

---

## 1. Présentation

Fuzz germanium (puis silicium) à 2 transistors, contrôles Fuzz et Volume. Topologie positive-ground PNP historique (Dallas Arbiter) puis versions Dunlop. Son gated, dynamique, sensible à l'impédance d'entrée (placer tôt dans la chaîne).

---

## 2. Sources

- Schémas ElectroSmash / GGG Fuzz Face
- Dunlop JHF1 / FFM pages produit

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Fuzz, Volume |
| Topologie | 2× BJT Ge/Si |
| Alim | 9 V (polarité selon révision) |

---

## 4. Technologie sonore

- Fuzz saturé très sensible au volume guitare
- Interaction forte avec micros passifs

---

## 5–6. Architecture / DSP

```text
Entrée → Gain/fuzz transistors → Volume → Sortie
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
