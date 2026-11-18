# Electro-Harmonix Big Muff (entrée fuzz app) — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `electro-harmonix-muff`

---

## 1. Présentation

Entrée fuzz de l'app pointant vers un Big Muff — croiser avec le dossier BigMuff-Pi (NYC). Sustain, scoop médium, double étage de clipping transistors+diodes.

---

## 2. Sources

- Voir BigMuff-Pi/documentation.md
- ehx.com/products/big-muff-pi

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Volume, Tone, Sustain |
| Type | Fuzz / Distortion / Sustainer |

---

## 4. Technologie sonore

- Double cascade de clip
- Tone scoop

---

## 5–6. Architecture / DSP

```text
Réutiliser modèle Big Muff Pi NYC
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
