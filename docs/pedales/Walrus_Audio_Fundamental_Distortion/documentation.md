# Walrus Audio Fundamental Distortion — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** `walrus-audio-distortion`

**Objectif :** documenter la Fundamental Distortion (série Fundamental), ses trois modes de clipping et les bases d’une émulation DSP pour WebAmp.

---

## 1. Présentation générale

La **Walrus Audio Fundamental Distortion** est une distorsion analogique de la série Fundamental (OKC, OK) : contrôles simplifiés (3 faders + switch 3 positions), qualité pro. Produit désormais **discontinué** côté boutique officielle, mais toujours pertinent pour l’émulation app.

Trois modes de clipping / profils :

| Mode | Description constructeur |
|---|---|
| **Dark** | Clipping silicium **asymétrique** + coupe des aigus — sombre et dynamique |
| **Si** | Hard clip silicium classique — compressé / crunchy |
| **LED** | Hard clip LED — dynamique / crunchy, **plus fort** (compenser au Volume) |

Commandes : **Gain**, **Tone**, **Volume** (faders). True bypass. 9 V DC centre négatif, 100 mA min.

**Principe fondamental :** l’émulation doit exposer **trois lois de saturation distinctes**, pas un seul hard clip avec un EQ.

---

## 2. Sources techniques

### 2.1 Officiel

**Page produit**  
https://www.walrusaudio.com/products/fundamental-series-distortion  
(local : [`page_officielle.html`](./page_officielle.html))

**Manuel anglais**  
[`manuel_utilisateur.pdf`](./manuel_utilisateur.pdf)  
https://cdn.shopify.com/s/files/1/0906/8480/files/Fundamental_Distortion_Digital_Manual.pdf

**Fundamental Start Guide**  
[`Fundamental_Start_Guide.pdf`](./Fundamental_Start_Guide.pdf)

### 2.2 Schéma électronique

Aucun schéma de service public n’a été trouvé pour cette référence moderne. La modélisation s’appuie sur :

- Les modes de clipping documentés par Walrus
- Des mesures sur pédale physique (recommandé)
- Des hypothèses de topologie standard (gain → clip selectable → tone → volume)

> Ne pas inventer un schéma « officiel ». Documenter toute reverse-ingénierie séparément et avec prudence juridique.

---

## 3. Caractéristiques matérielles

| Caractéristique | Valeur | Source |
|---|---|---|
| Type | Distorsion analogique 3 modes | Walrus |
| Commandes | Gain, Tone, Volume + switch Dark/Si/LED | Manuel |
| Bypass | True bypass | Page produit |
| Alimentation | 9 V DC centre négatif, ≥ 100 mA | Page produit |
| Dimensions | 4.33" × 2.16" × 1.61" | Page produit |
| Finish | Noir mat, encre jaune / off-white | Page produit |
| Statut | Discontinué (boutique) | Page produit |

---

## 4. Technologie sonore

### 4.1 Trois clipping

- **Dark** — asymétrie Si + LPF → moins d’aigus, dynamique, « doom »
- **Si** — hard clip Si symétrique → crunch compressé
- **LED** — seuil de clip plus élevé → headroom / niveau plus haut, crunch dynamique

### 4.2 Tone post-distorsion

Tone après clipping : gauche = coupe aigus, droite = boost aigus (doc Walrus).

### 4.3 Gain / Volume

Gain = saturation ; Volume = sortie. En mode LED, Volume doit souvent être baissé pour matcher Si/Dark.

---

## 5. Architecture fonctionnelle (hypothèse pédagogique)

```text
ENTRÉE
  → Gain
  → Sélecteur clipping (Dark | Si | LED)
  → Tone (tilt / LPF-HPF post)
  → Volume
  → SORTIE (true bypass hors chemin)
```

---

## 6. DSP recommandé

```text
Entrée → Gain
  → OS → f_clip(mode) → reconstruction
  → Tone
  → Volume (+ trim mode LED)
  → Sortie
```

Implémenter `f_clip` comme trois fonctions calibrables (asym Si, hard Si, hard LED). Mesurer les offsets de niveau entre modes.

---

## 7. Calibration

Pédale physique + matrice mode × Gain × Tone × Volume × niveaux d’entrée. Priorité : courbes I/O par mode, FR Tone, écart de loudness LED.

---

## 8–11. Tests, critères, limites

A/B par mode. Pas de schéma public → incertitude circuit élevée. Fidélité démontrable uniquement par mesures.

---

## 12. Ressources locales

| Fichier | Description |
|---|---|
| [`photo_face.jpg`](./photo_face.jpg) | Face avant |
| [`photo_gauche.jpg`](./photo_gauche.jpg) | Vue gauche |
| [`photo_droite.jpg`](./photo_droite.jpg) | Vue droite |
| [`manuel_utilisateur.pdf`](./manuel_utilisateur.pdf) | Manuel EN |
| [`Fundamental_Start_Guide.pdf`](./Fundamental_Start_Guide.pdf) | Start guide série |
| [`page_officielle.html`](./page_officielle.html) | Page Walrus |

Lien : [Fundamental Distortion](https://www.walrusaudio.com/products/fundamental-series-distortion)

---

## 13. Conclusion

Priorité DSP : **trois modes de clipping** + Tone post + compensation de niveau LED. Mesures indispensables faute de schéma public.
