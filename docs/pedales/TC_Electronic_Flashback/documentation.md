# TC Electronic Flashback Delay — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `tc-electronic-flashback`

---

## 1. Présentation

Delay multi-modes TC (Tape, Analog, Digital, Lo-Fi, etc.), TonePrint, Delay/Feedback/Level. Versions Flashback / Flashback 2 / X4.

---

## 2. Sources

- tcelectronic.com Flashback
- Manuels Flashback

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Multi-delay numérique |
| TonePrint | Oui (selon version) |

---

## 4. Technologie sonore

- Emulations delay historiques

---

## 5–6. Architecture / DSP

```text
delay(mode) + feedback + mix
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
