# Eventide Harmonizer (modèle app) — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `eventide-harmonizer`

---

## 1. Présentation

Référence générique Harmonizer Eventide (H910/H949/H3000 family). Pitch shifting + effets associés. Documenter comme pitch/harmony DSP plutôt que chorus.

---

## 2. Sources

- eventideaudio.com
- Manuels H9 / H3000

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Pitch / Harmonizer |
| Domaine | Numérique |

---

## 4. Technologie sonore

- Pitch shift, delay, modulation

---

## 5–6. Architecture / DSP

```text
Pitch/harmony algorithms
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
