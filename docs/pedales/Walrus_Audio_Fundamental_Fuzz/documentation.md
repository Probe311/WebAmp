# Walrus Audio Fundamental Fuzz — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `walrus-audio-fuzz`

---

## 1. Présentation

Fuzz série Fundamental : Gain, Tone, Volume + 3 modes (Gate / Rich / Bright typiques de la série). True bypass, 9 V.

---

## 2. Sources

- walrusaudio.com Fundamental Fuzz
- Manuel EN Shopify

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Commandes | Gain, Tone, Volume + switch 3 modes |
| Bypass | True bypass |

---

## 4. Technologie sonore

- Modes de fuzz distincts (gated / rich / bright)

---

## 5–6. Architecture / DSP

```text
Entrée → Gain → f_fuzz(mode) → Tone → Volume → Sortie
```

Objectif : temps réel, multi-instances, calibration sur matériel réel, suréchantillonnage des non-linéarités si nécessaire.

---

## 7–11. Calibration, tests, limites

- Captures DI, FR, I/O, écoute A/B
- Identifier la révision matérielle
- Pas de schéma public
- Sans pédale physique, la fidélité reste une approximation
- Schémas et marques soumis aux droits applicables

---

## 12. Ressources locales

Compléter ce dossier avec photos produit, manuels PDF et schémas (script `download.js`).

---

## 13. Conclusion

Modèle comportemental calibré en priorité ; raffiner selon mesures.
