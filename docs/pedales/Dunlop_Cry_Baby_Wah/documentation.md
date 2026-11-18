# Dunlop Cry Baby (entrée app) — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `dunlop-crybaby-classic`

---

## 1. Présentation

Entrée Cry Baby taguée phaser dans l'app — traiter comme wah Cry Baby classique. Croiser Dunlop_Cry_Baby.

---

## 2. Sources

- jimdunlop.com Cry Baby

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Wah |

---

## 4. Technologie sonore

- Inductor wah

---

## 5–6. Architecture / DSP

```text
wah bandpass
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
