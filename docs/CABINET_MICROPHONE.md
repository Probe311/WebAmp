# Cabinet IR et Microphone Simulator - Guide d'utilisation

## Cabinet IR (Impulse Response)

### À quoi ça sert ?

Le **Cabinet IR** simule le son d'un baffle d'amplificateur (cabinet) avec ses haut-parleurs. C'est la dernière étape de la chaîne audio avant la sortie.

**Utilité :**
- **Simulation réaliste** : Reproduit le son caractéristique d'un cabinet réel (Marshall 4x12, Fender 2x12, etc.)
- **Coloration du son** : Chaque cabinet a une signature sonore unique (fréquences, résonances)
- **Mix multi-cabinets** : Permet de mélanger plusieurs cabinets pour créer des sons hybrides
- **Remplacement du vrai matériel** : Évite d'avoir besoin d'un vrai cabinet pour enregistrer

**Comment ça marche :**
- Utilise des **Impulse Responses (IR)** : enregistrements de la réponse impulsionnelle d'un cabinet réel
- Applique une **convolution** : le signal passe à travers l'IR pour obtenir le son du cabinet
- **Mix** : Plusieurs cabinets peuvent être mélangés avec des niveaux différents

**Exemple d'utilisation :**
1. Jouer de la guitare avec des effets (distortion, delay, etc.)
2. Sélectionner un cabinet (ex: Marshall 1960A)
3. Le son est coloré par les caractéristiques du cabinet
4. Optionnel : Ajouter un 2ème cabinet (ex: Fender) et mixer les deux

---

## Microphone Simulator

### À quoi ça sert ?

Le **Microphone Simulator** simule la prise de son d'un microphone placé devant un cabinet. C'est ce qui se passe en studio : on enregistre le cabinet avec un micro.

**Utilité :**
- **Simulation de prise de son** : Reproduit comment un micro "entend" le cabinet
- **Position du micro** : Change le son selon où le micro est placé (on-axis = direct, off-axis = décalé)
- **Types de microphones** : Chaque micro a sa propre coloration (SM57 = dynamique, U87 = condensateur)
- **Distance** : Plus le micro est loin, plus le son est atténué
- **Mix multi-micros** : Permet d'utiliser plusieurs microphones simultanément (comme en studio)

**Comment ça marche :**
- **Filtres de réponse en fréquence** : Simule la courbe de réponse du microphone
- **Atténuation selon la distance** : Plus le micro est loin, moins il capte
- **Position** : On-axis = son direct, off-axis = son décalé (moins de hautes fréquences)
- **Mix** : Plusieurs micros peuvent être mélangés (ex: SM57 + U87)

**Exemple d'utilisation :**
1. Après le Cabinet IR, simuler un micro SM57
2. Position : On-axis (direct sur le haut-parleur)
3. Distance : 5 cm (proche = son direct et punchy)
4. Optionnel : Ajouter un 2ème micro (U87) en off-axis pour plus de profondeur

---

## Chaîne complète

```
Guitare → Effets → Amplificateur → Cabinet IR → Microphone Simulator → Room Simulator → Sortie
```

1. **Effets** : Distortion, delay, reverb, etc.
2. **Amplificateur** : Simulation de l'ampli (gain, EQ, etc.)
3. **Cabinet IR** : Simulation du baffle et des haut-parleurs
4. **Microphone Simulator** : Simulation de la prise de son
5. **Room Simulator** : Simulation de l'environnement (pièce, réverbération)

Cette chaîne reproduit fidèlement le processus d'enregistrement en studio !

