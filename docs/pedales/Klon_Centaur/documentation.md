# Klon Centaur — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `klon-centaur`

**Objectif :** documenter le Centaur / KTR (Bill Finnegan) pour émulation WebAmp.

---

## 1. Présentation

Overdrive « transparent » mythique (début/milieu des années 90). Caractéristiques : diodes **germanium**, **charge pump** (7660, rails élevés), pot **Gain** dual-gang (gain + blend clean/dirty), **Treble**, **Output**. Bypass bufferisé (KTR : buffer sortie switchable).

**Principe :** pas un Tube Screamer. Blend clean + dirty + Ge soft clip + treble post = signature.

---

## 2. Sources

- Schéma réplique GGG : [`schema_Klon_Centaur.pdf`](./schema_Klon_Centaur.pdf) — https://generalguitargadgets.com/effects-projects/distortion/kc/
- Aion Refractor (docs clone) : [`Aion_Refractor_docs.pdf`](./Aion_Refractor_docs.pdf)
- Build docs : [`Kloned_Centaur_build.pdf`](./Kloned_Centaur_build.pdf)

> Originaux hors production ; schémas = répliques pédagogiques. KTR = version production Finnegan.

---

## 3. Caractéristiques

| | |
|---|---|
| Type | Transparent overdrive / clean boost |
| Commandes | Gain, Treble, Output (+ buffer KTR) |
| Clip | Diodes Ge (~0,35 V) |
| AOP | TL072 (typique) |
| Alim | 9 V (charge pump interne) |

---

## 4. Technologie

- Gain bas = boost clean / léger edge
- Gain haut = OD + médiums centrés, character amp préservé
- Dual pot : augmente gain dirty **et** balance dry/wet
- Treble : aigu post-drive
- Buffer : gère chaînes longues / true bypass ambiant

---

## 5–6. Architecture / DSP

```text
Entrée → Buffer
  ├─ Chemin clean (blend)
  └─ Gain + clip Ge → Treble
       └─ Mix (Gain dual) → Output → [Buffer] → Sortie
```

DSP : parallel dry/wet, soft clip Ge, treble, charge-pump headroom optionnel (18 V rails simulés).

---

## 7–13. Calibration & conclusion

Priorité : blend Gain, Ge clip, transparence, treble. Comparer à KTR physique si possible.

## Ressources

| Fichier | |
|---|---|
| [`schema_Klon_Centaur.pdf`](./schema_Klon_Centaur.pdf) | Schéma réplique |
| [`Aion_Refractor_docs.pdf`](./Aion_Refractor_docs.pdf) | Docs clone |
| [`Kloned_Centaur_build.pdf`](./Kloned_Centaur_build.pdf) | Build + schéma |
