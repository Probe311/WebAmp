# Binson Echorec — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `binson-echorec`

---

## 1. Présentation

Echo à disque magnétique italien (Pink Floyd). Multi-têtes, Swell, switches de têtes. Caractère sombre / rythmique.

---

## 2. Sources

- Manuels Binson
- Analyses historiques

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Magnetic drum echo |
| Têtes | Multi-playback |

---

## 4. Technologie sonore

- Patterns rythmiques via têtes

---

## 5–6. Architecture / DSP

```text
multi-tap delay + sat
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
