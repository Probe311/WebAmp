# Electro-Harmonix Small Clone — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `electro-harmonix-small-clone`

---

## 1. Présentation

Chorus analogique célèbre (Kurt Cobain). Depth switch + Rate. Circuit MN3007/BBD simple et épais.

---

## 2. Sources

- ehx.com Small Clone
- Schémas Tonepad / GGG

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Rate, Depth (switch) |
| Circuit | BBD |

---

## 4. Technologie sonore

- Chorus épais / « underwater » à depth max

---

## 5–6. Architecture / DSP

```text
Dry + BBD modulé → mix
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
