---
layout: default
title: "Troubleshooting Telegram API Errors: 'Thumbnail as Animation' & 'No Document in Request' when using n8n HTTP Request"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-09
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "troubleshooting-telegram-api-errors-thumbnail-as-animation-no-doc"
---

# Troubleshooting Telegram API Errors: 'Thumbnail as Animation' & 'No Document in Request' when using n8n HTTP Request


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-09T21:27:47.662944`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

=== SECTION 0: RESUME DU PROBLEME EN FRANCAIS ===
L'utilisateur cherche à relayer des animations, stickers et documents via l'API Telegram à l'aide du nœud HTTP Request de n8n en réutilisant des `file_id` existants. Son flux échouait sur deux erreurs bloquantes de l'API Telegram (HTTP 400) : *« can’t use file of type Thumbnail as Animation »* et *« there is no document in the request »*. Ces interruptions résultent d'une part de la sélection de la clé imbriquée de vignette (`thumb.file_id` au lieu du `file_id` racine du média), et d'autre part de l'envoi d'un en-tête `multipart/form-data` mal formé au lieu d'un format `application/json` natif qui est le standard requis par Telegram lors du référencement d'un identifiant déjà hébergé sur leurs serveurs.

=== SECTION 1: ROOT CAUSE ANALYSIS ===
Deux mécanismes d'échec distincts se produisent au niveau du protocole HTTP et de la validation du schéma Telegram Bot API :

1. **Schema Divergence & Asset Type Mismatch (`can't use file of type Thumbnail as Animation`)** :
   Dans l'arborescence du payload Telegram (pour les types `Animation`, `Document` ou `Sticker`), l'objet parent expose son propre `file_id` (représentant le conteneur complet, ex. MP4 sans audio ou WEBP/TGS). Il expose également un sous-objet `thumbnail` (type `PhotoSize`) possédant un identifiant distinct. Les serveurs Telegram inspectent les métadonnées internes associées au hash du `file_id`. L'envoi du `thumbnail.file_id` vers les endpoints `/sendAnimation` ou `/sendSticker` lève une exception de validation de type : le serveur refuse d'instancier un lecteur d'animation sur une miniature statique.

2. **HTTP Payload Encoding & Parser Failure (`there is no document in the request`)** :
   Lorsqu'une requête est envoyée avec le header `Content-Type: multipart/form-data`, le parser de l'API Telegram s'attend à un flux binaire délimité par des `boundary` contenant les chunks du fichier sous la clé `document`. Lorsque l'utilisateur tente d'envoyer une chaîne textuelle (`file_id`) sous un encodage multipart configuré de manière incorrecte dans n8n, la frontière multipartite n'associe aucun stream binaire au champ requis, ce qui déclenche le rejet `400 Bad Request: there is no document in the request`. Lorsque le fichier existe déjà sur les serveurs Telegram, l'API accepte explicitement un corps `application/json`, évitant l'overhead et les erreurs d'encodage du multipart.

=== SECTION 2: TECHNICAL FIX PROTOCOL (80% ACTIONABLE) ===

### Étape 1 : Isoler la bonne clé dans les données entrantes (n8n Code ou Set Node)
Assurez-vous de capturer le `file_id` situé à la racine du document/animation, et non dans l'objet `thumbnail`/`thumb`.

*Pour une animation :*
`$json.message.animation.file_id` *(et NON `$json.message.animation.thumbnail.file_id`)*

*Pour un document :*
`$json.message.document.file_id` *(et NON `$json.message.document.thumb.file_id`)*

---

### Étape 2 : Configuration du nœud HTTP Request dans n8n
Basculez impérativement la méthode d'envoi en JSON pur.

1. **Method** : `POST`
2. **URL** : `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendDocument` (ou `/sendAnimation`, `/sendSticker`)
3. **Authentication** : `None` (le token est dans l'URL) ou via generic Credential
4. **Send Headers** : Activé
   * **Name** : `Content-Type`
   * **Value** : `application/json`
5. **Send Body** : Activé
6. **Body Content Type** : `JSON`
7. **Specify Body** : `Using JSON`

**Payload JSON exact :**
```json
{
  "chat_id": "={{ $json.chat_id }}",
  "document": "={{ $json.message.document.file_id }}",
  "caption": "Fichier transféré avec succès"
}
```

*Pour les animations (`/sendAnimation`) :*
```json
{
  "chat_id": "={{ $json.chat_id }}",
  "animation": "={{ $json.message.animation.file_id }}"
}
```

*Pour les stickers (`/sendSticker`) :*
```json
{
  "chat_id": "={{ $json.chat_id }}",
  "sticker": "={{ $json.message.sticker.file_id }}"
}
```

---

### Étape 3 : Snippet JSON n8n prêt à l'emploi (Workflow)
Copiez-collez ce nœud directement dans votre canvas n8n :

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "=https://api.telegram.org/bot{{ $vars.TELEGRAM_BOT_TOKEN }}/sendDocument",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
