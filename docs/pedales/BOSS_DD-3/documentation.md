# BOSS DD-3 Digital Delay — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `boss-dd3`

---

## 1. Présentation

Delay numérique compact classique (modes S/M/L + Hold). E.Level, F.Back, D.Time. Révisions DD-3 / DD-3A / DD-3T.

---

## 2. Sources

- boss.info DD-3
- Service Notes DD-3

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | E.LEVEL, F.BACK, D.TIME, Mode |
| Type | Digital delay |

---

## 4. Technologie sonore

- Hold/loop sur certaines versions

---

## 5–6. Architecture / DSP

```text
Delay line + feedback + mix
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
