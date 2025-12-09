# Reverse Method

## step 1
Pick a frequency calculation method ( )

Ouvert aux deux extrémités | Demi-onde (L_eff = c / (2 * f0))

    - Flûte traversière (Western) Delta = ~1.2 × rayon tube à chaque embouchure ( max 10 trou)
    - Bansuri, flûte simple ouverte Delta = ~0.6–1.2 × rayon tube ( max 10 trous)

Fermé à un bout, TSH | Quart d’onde | L_eff = c / (4 * f0)

    - Flûte Native américaine (double chambre) Delta = déplacement du nœud dû à TSH + end correction (Mesure souffle faible/fort permet estimation) (max 7 trous)

<!--  pas a integrer pour le moment
//| Xiao chinoise (tube conique, ouverture) | Ouvert / légèrement conique | Demi-onde modifiée | L_eff = (c / (2 * f0)) * f_cone | Δ = fonction de conicité + end correction | f_cone ≈ coefficient dépend de la pente du cône |
//| Shakuhachi | Ouvert / conique | Demi-onde modifiée | L_eff = (c / (2 * f0)) * f_cone | Δ = correction labium + conicité | Δ spécifique au labium et à la taille du bec |
//| Flûte à bloc (recorder, sweet pipe) | Ouvert | Demi-onde | L_eff = c / (2 * f0) | Δ = correction de labium (~0.5–1 × rayon) | Peut utiliser deux mesures pour ajuster Δ |
//| Didgeridoo ou flûte longue | Fermé / tube très long | Quart d’onde | L_eff = c / (4 * f0) | Δ = end correction + éventuellement couplage labium | Peut utiliser mesures basse/haute pression pour Δ | -->

## step 2

User -> enters inputs informations
Interface input = 
    - Lphys( longueur mesurée de la flute)
    - Dinner ( diametre interieur du tube)
    - temperature ( pour la vitesse du son , par defaut 20) (optionnel)
    - Note 1( frequence mesurée de la note) souffle normal
    - Note 2( frequence mesurée de la note) souffle fort (optionnel)

Code -> Calcultate:
    - Leff (longueur effective) depuis "calculation method"
    - Delta Moyen ( si note 2 renseignée, sinon Delta default)

## step 3
Interface Notes (low to high)= 
    - Note input *5
    - bouton + ( ajouter une note) ( visible tant que Notes.length < max notes)
### Pour chaque note
User -> enter input of target notes in order
interface Note = 
    - f_target ( frequence cible)
    - h_target ( diametre du trou cible) ( default 5mm)
    - pos ( position du trou en mm)
    - Bouton mesure -> ( only visible on 1st note or the note following a measured note)
        User enter input of measured note & diameter
            - f_measured
            - h_measured

When a target note is added:
Code -> calculate:
    - hole position
    - shift following notes position for each note according to a formule

When a measured note is added :
Code -> 
    - Calculate new Delta ( gain precision)
    - recalculate hole positions ( targets only)
    - shift following notes position for each note according to a formule

