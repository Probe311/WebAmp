# Dallas Rangemaster Treble Booster — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `treble-booster`

---

## 1. Présentation

**Dallas Arbiter Rangemaster** (années 60) : treble booster à **1 transistor germanium PNP**, masse positive. Conçu pour pousser les aigus dans un ampli britannique saturé (Marshall, etc.). Un seul contrôle **Boost**.

**Principe :** HPF d’entrée + gain Ge élevé + compression naturelle Ge — pas une OD à diodes.

---

## 2. Sources

- [`schema_Rangemaster_PNP.pdf`](./schema_Rangemaster_PNP.pdf)
- [`schema_Rangemaster_stripboard.pdf`](./schema_Rangemaster_stripboard.pdf)
- GGG Rangemaster project ; analyses ElectroSmash (archivées)
- Transistor historique typique : OC44 / Ge PNP sélectionné

---

## 3. Caractéristiques

| | |
|---|---|
| Type | Treble booster Ge |
| Alim | 9 V **positive ground** (original) |
| Commande | Boost (souvent 10 k) |
| Entrée | Cap ~4,7–5 nF (HPF critique) |
| Topologie | Common emitter PNP |

---

## 4–6. Tech / DSP

```text
Entrée → HPF (Cin) → Gain Ge (Boost) → Couplage → Sortie
```

DSP : HPF calibré + soft sat / compression Ge + gain. Variantes NPN masse négative existent (clones).

---

## 12. Ressources

| Fichier | |
|---|---|
| [`schema_Rangemaster_PNP.pdf`](./schema_Rangemaster_PNP.pdf) | Schéma PNP |
| [`schema_Rangemaster_stripboard.pdf`](./schema_Rangemaster_stripboard.pdf) | Layout |
