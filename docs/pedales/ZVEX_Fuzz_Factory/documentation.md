# Z.Vex Fuzz Factory — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `zvex-fuzz-factory`

---

## 1. Présentation

Fuzz boutique ZVEX aux contrôles multiples (Volume, Gate, Comp, Drive, Stab) produisant oscillations, gated fuzz et textures instables. Circuit à transistors germanium.

---

## 2. Sources

- zvex.com
- Analyses / schémas DIY communautaires

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Vol, Gate, Comp, Drive, Stab |
| Caractère | Oscillations / gated fuzz |

---

## 4. Technologie sonore

- Stabilizer contrôle la stabilité du circuit
- Gate et Comp sculptent l’attaque

---

## 5–6. Architecture / DSP

```text
Entrée → Réseau fuzz multi-param → Sortie
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
