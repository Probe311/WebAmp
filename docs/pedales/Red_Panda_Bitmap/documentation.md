# Red Panda Bitmap — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `red-panda-bitmap`

---

## 1. Présentation

Bitcrusher / sample-rate reducer Red Panda (Bitmap 2 : crush, freq, mix, filtres).

---

## 2. Sources

- redpandalab.com Bitmap

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Bitcrusher |

---

## 4. Technologie sonore

- Bit depth / SR reduction

---

## 5–6. Architecture / DSP

```text
bitcrush + SR
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
