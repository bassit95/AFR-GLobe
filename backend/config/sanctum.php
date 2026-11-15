<?php

use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Laravel\Sanctum\Http\Middleware\AuthenticateSession;
use Laravel\Sanctum\Sanctum;

return [

    /*
    |--------------------------------------------------------------------------
    | DOMAINES STATEFUL (SPA)
    |--------------------------------------------------------------------------
    | Liste des origines autorisées à recevoir les cookies de session.
    | ⚠️ CRUCIAL : si le frontend n'est PAS dans cette liste, les cookies
    | de session ne seront PAS envoyés → /me retournera 401 → l'utilisateur
    | sera déconnecté à chaque requête.
    |
    | Par défaut, cette config inclut :
    |   - localhost, localhost:3000 (React CRA)
    |   - 127.0.0.1, 127.0.0.1:8000
    |   - ::1 (IPv6 localhost)
    |   - + l'URL de l'app courante (via Sanctum::currentApplicationUrlWithPort())
    |
    | ⚠️⚠️⚠️ IL MANQUE localhost:5173 (Vite) ⚠️⚠️⚠️
    | → Soit ajoute-le ici en dur, soit définis dans .env :
    |     SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost,127.0.0.1:8000
    |   (recommandé pour la prod : ajoute aussi ton domaine de prod)
    */
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1', // ← ajoute ,localhost:5173
        Sanctum::currentApplicationUrlWithPort(),
    ))),

    /*
    |--------------------------------------------------------------------------
    | GUARDS SANCTUM
    |--------------------------------------------------------------------------
    | Guards utilisés par Sanctum pour l'authentification session-based.
    | 'web' = session guard (cookies) → ✅ correct pour SPA
    | Si Sanctum ne trouve pas l'utilisateur dans les guards, il fallback
    | sur le token Bearer (Authorization: Bearer xxx) → permet les 2 modes.
    */
    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | EXPIRATION DES TOKENS
    |--------------------------------------------------------------------------
    | null = les tokens Sanctum n'expirent JAMAIS (première-party sessions
    | ne sont pas affectées par cette valeur de toute façon)
    |
    | Pour une SPA, null est OK (la session expire via config('session.lifetime'))
    | Pour des tokens API publics, tu voudrais plutôt 60 (minutes)
    */
    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | PRÉFIXE DES TOKENS
    |--------------------------------------------------------------------------
    | Préfixe ajouté aux tokens Sanctum (ex: "sk_live_...") pour permettre
    | aux outils de sécurité (GitHub Secret Scanning) de détecter les fuites.
    | Vide par défaut = pas de préfixe. OK pour notre usage SPA.
    */
    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | MIDDLEWARE SANCTUM
    |--------------------------------------------------------------------------
    | Middlewares utilisés par Sanctum pendant le cycle de requête SPA :
    | - authenticate_session : rafraîchit la session à chaque requête
    | - encrypt_cookies      : chiffre les cookies de session
    | - validate_csrf_token  : valide le token CSRF sur les requêtes mutatives
    |                          → si le frontend n'envoie pas X-XSRF-TOKEN,
    |                            Laravel renverra 419 CSRF token mismatch
    */
    'middleware' => [
        'authenticate_session' => AuthenticateSession::class,
        'encrypt_cookies'      => EncryptCookies::class,
        'validate_csrf_token'  => ValidateCsrfToken::class,
    ],

];