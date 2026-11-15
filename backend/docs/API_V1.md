# AFRICA GLOBAL — API V1

> Documentation officielle de l'API REST African Creators V1.
> Version stable : `v1`
> Dernière mise à jour : 2026-10-10

---

## 1. Introduction

### 1.1 Base URL et versioning

Toutes les routes sont préfixées par :

```
/api/v1
```

Exemple : `https://api.africaglobal.com/api/v1/creators`

**Principe de versioning :**
- La version est **dans l'URL** (`/v1/`), pas dans un header.
- Une nouvelle version (`/v2/`) ne cassera pas `/v1/`.
- Les changements non-cassants (ajout de champ) ne créent pas de nouvelle version.
- Les changements cassants (suppression/renommage de champ) créent une v2.

### 1.2 Format des réponses

**Toutes les réponses sont en JSON.** Le contrat est identique sur tous les endpoints.

#### Succès (avec données)

```json
{
  "success": true,
  "message": "Créateurs récupérés avec succès.",
  "data": [ /* objet ou tableau */ ],
  "meta": { /* optionnel — pagination, statistiques */ }
}
```

#### Succès (sans données)

```json
{
  "success": true,
  "message": "Ville supprimée avec succès.",
  "data": null
}
```

#### Erreur de validation (422)

```json
{
  "success": false,
  "message": "Les données fournies sont invalides.",
  "errors": {
    "email": ["L'email est obligatoire."],
    "password": ["Le mot de passe doit contenir au moins 8 caractères."]
  }
}
```

#### Erreur générique (401, 403, 404, 500)

```json
{
  "success": false,
  "message": "Ressource introuvable."
}
```

### 1.3 Codes HTTP utilisés

| Code | Signification | Cas d'usage |
|---|---|---|
| **200** | OK | Lecture ou mise à jour réussie |
| **201** | Created | Ressource créée (POST réussi) |
| **204** | No Content | Suppression sans body (optionnel, rare) |
| **401** | Unauthorized | Pas de token, ou token invalide |
| **403** | Forbidden | Authentifié mais rôle/ability insuffisant |
| **404** | Not Found | Ressource inexistante (ou soft-deleted) |
| **422** | Unprocessable Entity | Validation échouée |
| **429** | Too Many Requests | Rate limit dépassé |
| **500** | Internal Server Error | Erreur serveur |

**Règle :** un `200` ne signifie **jamais** « erreur silencieuse ». Une erreur métier retourne toujours 4xx ou 5xx.

### 1.4 Formats standards

| Type | Format | Exemple |
|---|---|---|
| **Dates** | ISO 8601 UTC | `2026-10-10T12:30:00+00:00` |
| **Montants** | Decimal, sans devise | `50000.00` |
| **Devise** | Code ISO 4217 | `XOF`, `EUR` |
| **Slugs** | kebab-case, unique | `creator-demo-a` |
| **URLs images** | Chemin public | `/storage/demo/creators/creator-a.jpeg` |

---

## 2. Authentification

### 2.1 Vue d'ensemble

Africa Global utilise **Laravel Sanctum** avec des **Personal Access Tokens (PAT)**.

**Deux rôles :**

| Rôle | Champ `role` | Abilities du token | Peut faire |
|---|---|---|---|
| **Admin** | `admin` | `["*"]` | Lecture + écriture sur toutes les ressources |
| **User** | `user` | `["read"]` | Lecture seule + son propre profil |

**Sécurité :**
- Toutes les routes admin exigent `auth:sanctum` + `role=admin` + ability `*`.
- Les lectures publiques ne nécessitent **aucun token**.
- Le token doit être envoyé dans le header `Authorization`.

**En-tête requis pour les routes protégées :**

```
Authorization: Bearer {token}
Accept: application/json
```

---

### 2.2 Inscription — `POST /api/v1/register`

Crée un nouvel utilisateur avec le rôle `user` et retourne un token.

**Body :**

```json
{
  "name": "Amina Diallo",
  "email": "amina@example.com",
  "password": "motdepasse123"
}
```

**Règles de validation :**

| Champ | Règle |
|---|---|
| `name` | requis, string, max 255 |
| `email` | requis, email valide, unique |
| `password` | requis, min 8 caractères, lettres + chiffres |

**Réponse 201 :**

```json
{
  "success": true,
  "message": "Inscription réussie.",
  "data": {
    "user": {
      "id": 2,
      "name": "Amina Diallo",
      "email": "amina@example.com",
      "role": "user",
      "created_at": "2026-10-10T12:30:00+00:00"
    },
    "token": "2|aLongGeneratedTokenValue...",
    "abilities": ["read"]
  }
}
```

**Erreurs possibles :**
- `422` — validation échouée

---

### 2.3 Connexion — `POST /api/v1/login`

Authentifie un utilisateur et retourne un token dont les abilities dépendent du rôle.

**Body :**

```json
{
  "email": "admin@africaglobal.test",
  "password": "password"
}
```

**Réponse 200 (admin) :**

```json
{
  "success": true,
  "message": "Connexion réussie.",
  "data": {
    "user": {
      "id": 1,
      "name": "Africa Global Admin",
      "email": "admin@africaglobal.test",
      "role": "admin",
      "created_at": "2026-10-10T12:00:00+00:00"
    },
    "token": "1|aLongGeneratedTokenValue...",
    "abilities": ["*"]
  }
}
```

**Réponse 200 (user normal) :** identique, mais `abilities: ["read"]`.

**Erreurs possibles :**
- `401` — identifiants incorrects
- `422` — validation échouée
- `429` — trop de tentatives (>5 par minute)

**Rate limiting :**
- **5 tentatives / minute / IP.**
- Au-delà : `429 Too Many Requests`.

---

### 2.4 Profil connecté — `GET /api/v1/me`

Retourne le profil de l'utilisateur authentifié.

**Headers :**

```
Authorization: Bearer {token}
Accept: application/json
```

**Réponse 200 :**

```json
{
  "success": true,
  "message": "Profil récupéré avec succès.",
  "data": {
    "id": 1,
    "name": "Africa Global Admin",
    "email": "admin@africaglobal.test",
    "role": "admin",
    "created_at": "2026-10-10T12:00:00+00:00"
  }
}
```

**Erreurs possibles :**
- `401` — pas de token, ou token invalide/expiré

---

### 2.5 Déconnexion — `POST /api/v1/logout`

Révoque **uniquement le token courant**. Les autres tokens de l'utilisateur restent valides.

**Headers :**

```
Authorization: Bearer {token}
```

**Réponse 200 :**

```json
{
  "success": true,
  "message": "Déconnexion réussie."
}
```

Après cet appel, **le même token ne fonctionne plus** sur `/me` ou toute autre route protégée.

**Erreurs possibles :**
- `401` — pas de token

---

### 2.6 Exemple complet (workflow)

```bash
# 1. Login
curl -X POST https://api.africaglobal.com/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@africaglobal.test","password":"password"}'
# → récupère { token: "1|xxx" }

# 2. Appel protégé
curl https://api.africaglobal.com/api/v1/me \
  -H "Authorization: Bearer 1|xxx"
# → { user: { ... } }

# 3. Logout
curl -X POST https://api.africaglobal.com/api/v1/logout \
  -H "Authorization: Bearer 1|xxx"
# → le token est révoqué
```

---

**Fin des sections 1 et 2.**

Sections suivantes (dans la suite de ce document) :
- 3. Endpoints publics (lecture)
- 4. Endpoints relationnels
- 5. Recherche globale
- 6. Endpoints admin (écriture)
- 7. Fichiers & images
- 8. Pagination