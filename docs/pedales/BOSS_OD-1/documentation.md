# BOSS OD-1 OverDrive — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `boss-od1`

---

## 1. Présentation

Première overdrive compacte **BOSS** (1977–78). Soft-clip asymétrique (diodes dans feedback), **2 knobs** (OVERDRIVE, LEVEL) — pas de TONE. Ancêtre direct de la SD-1 (qui ajoute TONE et change le clipping).

**Principe :** soft clip asymétrique + mid push ; calibrer vs SD-1 (différences diodes / tone).

---

## 2. Sources

- Service Notes : [`BOSS_OD-1_SERVICE_NOTES.pdf`](./BOSS_OD-1_SERVICE_NOTES.pdf) (si dispo)
- Schéma : [`schema_OD1.png`](./schema_OD1.png)
- Hobby-Hour / synfo.nl Service Notes historiques
- Page produit moderne liée : OD-1W (Waza) sur boss.info

---

## 3. Caractéristiques (Service Notes historiques)

| | |
|---|---|
| Commandes | OVERDRIVE, LEVEL |
| Alim | 9 V / ~3,5 mA |
| Zin | 220–470 kΩ selon édition |
| AOP | μPC4558C |
| Clip | Diodes asymétriques (feedback) |

---

## 4–6. Tech / DSP

```text
Entrée → Buffer → Gain OVERDRIVE + soft clip asym → LEVEL → Sortie
```

DSP : réutiliser base SD-1 sans réseau TONE ; asymétrie diodes OD-1 spécifique.

---

## 12. Ressources

| Fichier | |
|---|---|
| [`BOSS_OD-1_SERVICE_NOTES.pdf`](./BOSS_OD-1_SERVICE_NOTES.pdf) | Service Notes |
| [`schema_OD1.png`](./schema_OD1.png) | Schéma |
| [`photo_OD1W.jpg`](./photo_OD1W.jpg) | Visuel (réf. OD-1W) |
