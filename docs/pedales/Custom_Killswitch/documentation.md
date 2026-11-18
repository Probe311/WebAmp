# Custom Killswitch / Stutter — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `killswitch-stutter`

---

## 1. Présentation

Killswitch momentané pour stutter rhythmique. Pas de circuit de traitement — gate on/off.

---

## 2. Sources

- Pratique pedalboard

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
| Type | Momentary mute |

---

## 4. Technologie sonore

- Stutter / silence

---

## 5–6. Architecture / DSP

```text
gate * signal
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
