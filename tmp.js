// onglet Reverse Engineering Acoustics

//principe de la methode est etapes a implementer .

//cette méthode correspond à une famille bien définie de techniques en acoustique des flûtes, même si l'ensemble complet n’a pas un nom unique.
//Elle combine 3 approches reconnues, chacune ayant son propre nom scientifique.
//
//Voici exactement comment on la classifierait officiellement :
//
//🟦 1) “Méthode acoustique inversée” (Inverse Acoustic Modeling)
//
//C’est le cœur de la méthode.
//
//➤ À partir de fréquences mesurées, on calcule la longueur acoustique effective
//au lieu de faire l’inverse (calculer la fréquence à partir de la longueur).
//
//Nom officiel :
//
//✔ Inverse Acoustic Modeling
//✔ Inverse Bore Reconstruction
//
//(termes utilisés dans Benade, Coltman, Nederveen)
//
//C’est une méthode scientifique reconnue.
//
//🟦 2) “Correction de nœud” → Node Shift Compensation
//
//On calcule le déplacement du nœud du quart d’onde :
//
//Δ=𝐿𝑒𝑓𝑓−𝐿𝑝ℎ𝑦𝑠Δ=Leff	​−Lphys
//Ce procédé a un nom dans la littérature acoustique :
//
//✔ Node Shift Compensation
//✔ End Correction Calibration (variante)
//
//On l’utilise aussi pour les tuyaux d’orgue bouchés.
//
//🟦 3) “Méthode de Benade modifiée pour quart d’onde”
//
//Benade travaille sur les flûtes à tube ouvert.
//Mais dans une flûte Native (tube fermé), on adapte sa formule.
//
//C’est ce qu’on appelle :
//
//✔ Modified Benade Hole Placement Method
//
//(terme utilisé par des chercheurs comme Coltman et Kort)
//
//ou plus simplement :
//
//✔ Benade-Style Hole Placement for Quarter-Wave Flutes
//🟦 4) “Heuristique de correction des trous” → (Tone Hole Correction Heuristics)
//
//Les corrections selon le diamètre du trou :𝐶𝑖=𝛼⋅𝑟𝑖Ci	​=α⋅ri	​
//Ce type d’approche est connu sous :
//
//✔ Heuristic Tone Hole Correction
//✔ Empirical Hole Offset Method
//
//C'est utilisé dans WIDesigner et Flutopedia.
//
//🟦 5) “Vérification ergonomique” → (Handspan-Constrained Layout Optimization)
//
//C’est une branche d’étude ergonomique, pas acoustique.


// Etape Zero L'utilisateur va choisir le type de calcul pour sa flute : 
//| Type de flûte | Tube | Fondamental (f0) | Formule de longueur acoustique | Δ (correction / décalage nœud) | Notes |
//|---------------|------|-----------------|-------------------------------|-------------------------------|-------|
//| Flûte traversière (Western) | Ouvert aux deux extrémités | Demi-onde | L_eff = c / (2 * f0) | End correction (~1.2 × rayon tube à chaque embouchure) | Standard, Benade appliqué directement |
//| Bansuri, flûte simple ouverte | Ouvert | Demi-onde | L_eff = c / (2 * f0) | End correction simple (~0.6–1.2 × rayon tube) | Peut s’utiliser avec Δ constant ou mesuré |
//| Flûte Native américaine (double chambre) | Fermé à un bout, TSH | Quart d’onde | L_eff = c / (4 * f0) | Δ = déplacement du nœud dû à TSH + end correction | Mesure souffle faible/fort permet estimation Δ |
//| Xiao chinoise (tube conique, ouverture) | Ouvert / légèrement conique | Demi-onde modifiée | L_eff = (c / (2 * f0)) * f_cone | Δ = fonction de conicité + end correction | f_cone ≈ coefficient dépend de la pente du cône |
//| Shakuhachi | Ouvert / conique | Demi-onde modifiée | L_eff = (c / (2 * f0)) * f_cone | Δ = correction labium + conicité | Δ spécifique au labium et à la taille du bec |
//| Flûte piccolo | Ouvert | Demi-onde | L_eff = c / (2 * f0) | End correction ± embouchure | Tube très petit, Δ proportionnel au rayon |
//| Flûte à bloc (recorder, sweet pipe) | Ouvert | Demi-onde | L_eff = c / (2 * f0) | Δ = correction de labium (~0.5–1 × rayon) | Peut utiliser deux mesures pour ajuster Δ |
//| Didgeridoo ou flûte longue | Fermé / tube très long | Quart d’onde | L_eff = c / (4 * f0) | Δ = end correction + éventuellement couplage labium | Peut utiliser mesures basse/haute pression pour Δ |

// selection parmis une liste , et application de l'algorythme en fonction

//
// 1. Vitesse du son (corrigée température)
// -------------------------------------------------------------
function speedOfSound(T) {
    return 331.4 + 0.6 * T;
}

//
// 2. Longueurs acoustiques mesurées sur la flûte réelle
// (souffle faible et fort)
// -------------------------------------------------------------
function measuredEffectiveLengths(c, f_low, f_high) {
    // cette parti est a adapter en fonctio nde la flute choisi ,


    const L_eff_low = c / (4 * f_low);
    const L_eff_high = c / (4 * f_high);
    return { L_eff_low, L_eff_high };
}

//
// 3. Déplacement du nœud (comparaison acoustique vs physique)
// -------------------------------------------------------------
function nodeShift(L_eff_low, L_eff_high, L_phys, mode = "medium") {
    const delta_low = L_eff_low - L_phys;
    const delta_high = L_eff_high - L_phys;

    if (mode === "low") return delta_low;
    if (mode === "high") return delta_high;
    return (delta_low + delta_high) / 2; // mode mixte par défaut
}

//
// 4. Conversion note → fréquence (A4 = 440Hz)
// TODO: adapter la table relative a la frequence ( on peut se retrouver avec un A4 a 432 aussi)
// -------------------------------------------------------------
function noteToFreq(note) {
    // note ex: "A4", "C#5"
    const A4 = 440;
    const noteRegex = /^([A-G])(#|b)?(\d)$/;
    const semitones = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

    const match = note.match(noteRegex);
    if (!match) throw new Error("Note invalide : " + note);

    let [_, letter, accidental, octave] = match;
    octave = parseInt(octave);

    let n = semitones[letter];
    if (accidental === "#") n += 1;
    if (accidental === "b") n -= 1;

    const semitoneDistance = n + (octave - 4) * 12;
    return A4 * Math.pow(2, semitoneDistance / 12);
}

//
// 5. Position brute des trous (avant corrections)
// -------------------------------------------------------------
function rawHolePositions(c, delta_target, notes) {
    return notes.map(note => {
        const f = noteToFreq(note);
        const L_eff = c / (4 * f);
        const x0 = L_eff - delta_target; // position avant correction trou
        return { note, f, L_eff, x0 };
    });
}

//
// 6. Correction due au diamètre du trou et à l'épaisseur du tube
// -------------------------------------------------------------
function adjustForHoleDiameter(rawPositions, diameters, wallThickness) {
    return rawPositions.map((pos, i) => {
        const d = diameters[i];
        const r = d / 2;

        // coefficient heuristique
        let alpha = 1.0;
        if (wallThickness >= 3 && wallThickness <= 5) alpha = 0.9;
        if (wallThickness > 5) alpha = 0.7;

        const C = alpha * r;  // correction
        const x = pos.x0 - C; // position corrigée

        return {
            ...pos,
            d,
            correction: C,
            x
        };
    });
}

//
// 7. Vérification ergonomique simple ( ne pas laisser les espaces etre trop proche)
// -------------------------------------------------------------
function ergonomicCheck(holes, handSize = "medium") {
    const minDist = {
        small: 16,
        medium: 18,
        large: 20
    }[handSize];

    const warnings = [];

    for (let i = 1; i < holes.length; i++) {
        const dist = holes[i].x - holes[i - 1].x;

        if (dist < minDist) {
            warnings.push(`Trou ${i} et ${i+1} trop proches (${dist.toFixed(1)} mm)`);
        }
    }

    return { holes, warnings };
}

//
// 8. Génération du plan de perçage
// -------------------------------------------------------------
function drillingPlan(holes, toleranceCents = 20) {
    return holes.map(h => ({
        note: h.note,
        targetFreq: h.f,
        position_mm: h.x,
        drillStart_mm: h.d - 1,      // commencer 1mm plus petit
        drillFinal_mm: h.d,
        toleranceCents
    }));
}

//
// ---------- PIPELINE COMPLET ----------
//
function designNAF(params) {
    const {
        D_int,
        L_phys,
        T,
        wallThickness,
        f_low,
        f_high,
        breathMode,
        notes,
        diameters,
        handSize
    } = params;

    const c = speedOfSound(T);

    const { L_eff_low, L_eff_high } = measuredEffectiveLengths(c, f_low, f_high);

    const delta_target = nodeShift(L_eff_low, L_eff_high, L_phys, breathMode);

    const rawPositions = rawHolePositions(c, delta_target, notes);

    const corrected = adjustForHoleDiameter(rawPositions, diameters, wallThickness);

    const ergonomic = ergonomicCheck(corrected, handSize);

    const plan = drillingPlan(ergonomic.holes);

    return {
        speedOfSound: c,
        L_eff_low,
        L_eff_high,
        delta_target,
        rawPositions,
        correctedPositions: corrected,
        ergonomicWarnings: ergonomic.warnings,
        drillingPlan: plan
    };
}




// calcule diamètre équivalent pour un trou ovale (Dmaj, Dmin en mm)
function equivalentDiameter(Dmaj, Dmin) {
  return Math.sqrt(Dmaj * Dmin);
}

// calcule alpha expérimental à partir d'une mesure
// inputs:
//  f_mes: fréquence mesurée (Hz) avec le trou ouvert
//  c: vitesse du son (m/s)
//  mode: "half" ou "quarter" (demi-onde ou quart d'onde)
//  x_trou: position du centre du trou en mm depuis embouchure
//  delta: correction nœud/embouchure en mm (Δ)
//  Deq: diamètre équivalent du trou en mm
function computeAlphaFromMeasurement(f_mes, c, mode, x_trou, delta, Deq) {
  // convert units: c in m/s, L_eff in m, x_trou/delta/Deq in mm
  const L_eff_m = (mode === "quarter") ? c / (4 * f_mes) : c / (2 * f_mes);
  const L_eff_mm = L_eff_m * 1000;

  const C_mes = L_eff_mm - (x_trou + delta); // en mm
  const r_eq = Deq / 2.0; // mm

  const alpha_exp = C_mes / r_eq;
  return { C_mes, r_eq, alpha_exp };
}


/* | Flûte                        | Peut-on calibrer Δ avec deux mesures ? | Fiabilité        |
| ---------------------------- | -------------------------------------- | ---------------- |
| Flûte native (NAF)           | ✔️ Oui                                 | ⭐⭐⭐⭐⭐ Excellente |
| Bansuri                      | ✔️ Oui                                 | ⭐⭐⭐⭐⭐            |
| Flûte simple ouverte         | ✔️ Oui                                 | ⭐⭐⭐⭐⭐            |
| Xiao                         | ✔️ Oui mais modèle plus complexe       | ⭐⭐⭐⭐             |
| Shakuhachi                   | ✔️ Oui mais nécessite stabilité        | ⭐⭐⭐⭐             |
| Traversière                  | ⚠️ Partiel                             | ⭐⭐⭐              |
| Flûte à bec                  | ❌ Non                                  | ⭐                |
| Ocarina / flûtes globulaires | ❌ Non                                  | Impossible       |
| Didgeridoo                   | ❌ Non                                  | Impossible       | */
