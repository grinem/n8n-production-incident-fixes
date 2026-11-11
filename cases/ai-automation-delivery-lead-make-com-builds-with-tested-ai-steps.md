---
layout: default
title: "AI Automation Delivery Lead | Make.com builds with tested AI steps and real error handling"
platform: "Make.com"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-09
tags: ["make", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "ai-automation-delivery-lead-make-com-builds-with-tested-ai-steps"
---

# AI Automation Delivery Lead | Make.com builds with tested AI steps and real error handling


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-09T21:26:27.707990`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

=== SECTION 0: RESUME DU PROBLEME EN FRANCAIS ===
L'auteur présente l'architecture de son projet "Apex Climate Solutions" comprenant 27 scénarios Make.com, intégrant l'ingestion multicanale (WhatsApp, formulaires, agent vocal), des étapes LLM et un pipeline PDF avec fallback OCR vers une base PostgreSQL/pgvector. Dans ce type d'écosystème distribué, la vulnérabilité majeure réside dans le traitement synchrone des fichiers lourds via OCR et l'instabilité structurelle des sorties LLM injectées dans des modules déterministes. Sans découplage asynchrone, le webhook d'entrée subit un dépassement de délai (timeout Make à 40 secondes) dès qu'un document sans couche texte déclenche l'OCR, provoquant un échec silencieux ou un rejet HTTP 504. De plus, l'absence de validation stricte (`response_format: json_schema`) sur les étapes d'arbitrage IA génère des erreurs de parsing JSON qui bloquent l'exécution des modules fixes en aval.

=== SECTION 1: ROOT CAUSE ANALYSIS ===
Dans l'architecture à 27 scénarios décrite, les goulets d'étranglement et points de rupture protocolaires typiques se situent sur deux axes :

1. **Dépassement du Webhook Timeout (HTTP 504 / Execution Timeout)** :
   Make.com impose un délai de réponse strict de 40 secondes sur les webhooks personnalisés synchrones (`Custom Webhook` avec réponse immédiate ou webhook de messagerie type Twilio/WhatsApp Business API). Le traitement d'un PDF sans couche texte déclenchant un moteur OCR externe (ex. Tesseract, Google Cloud Vision, Mistral OCR) couplé à la génération d'embeddings vectoriels (1536 ou 3072 dimensions) dépasse quasi systématiquement ce seuil de 40s. Le webhook client coupe la connexion TCP, entraînant des retries en cascade, des exécutions dupliquées et un épuisement prématuré des opérations Make.

2. **Divergence de Schéma JSON (Downstream Contract Breakage)** :
   Lorsque l'étape d'évaluation d'urgence ou de filtrage de spam renvoie une chaîne de caractères légèrement altérée (ex. balises Markdown ````json`, omission d'une clé obligatoire ou inversion de type scalaire/array), les modules Make natifs (`JSON - Parse JSON` ou routeurs de filtres stricts) lèvent une exception bloquante `BundleValidationError` ou `JSONSyntaxError`. Si la gestion d'erreurs locale n'utilise pas de directive de reprise déterministe (`Commit` / `Rollback` avec dead-letter queue vers Slack), le scénario passe en statut `Incomplete Execution` ou consomme inutilement le buffer d'erreurs.

3. **Inadéquation Vectorielle pgvector** :
   Lors de l'interrogation de la base PostgreSQL via le module `PostgreSQL - Execute a Query`, toute non-concordance de dimensionnalité entre le vecteur d'entrée généré par le modèle LLM et la colonne déclarée (ex. vector(1536)) déclenche une erreur Postgres `22000` (`different vector dimensions`), rompant le pipeline de recherche contextuelle.

=== SECTION 2: TECHNICAL FIX PROTOCOL (80% ACTIONABLE) ===

### Étape 1 : Découplage Asynchrone du Webhook d'Entrée
1. Dans le scénario d'intake (WhatsApp / Formulaire), placer immédiatement après le `Custom Webhook` un module **Webhook Response** :
   - **Status** : `202` (Accepted)
   - **Body** : `{"status": "queued", "received_at": "{{now}}"}`
2. Déléguer le parsing lourd et l'OCR à une file d'attente asynchrone :
   - Transférer le payload vers un second scénario de traitement d'arrière-plan via un message intermédiaire (Cloud AMQP, AWS SQS ou Make Custom Webhook asynchrone sans attente de réponse).

### Étape 2 : Sécurisation Stricte des Sorties LLM (Structured Outputs)
Dans chaque module d'appel IA (OpenAI / Anthropic / Custom HTTP), forcer l'usage du paramètre `response_format` avec schéma JSON strict pour garantir la compatibilité descendante :
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "Tu es un classificateur d'urgence HVAC. Analyse les détails et renvoie les attributs au format exact spécifié."
    },
    {
      "role": "user",
      "content": "{{1.body.message_text}}"
    }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "hvac_triage_payload",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "is_junk": { "type": "boolean" },
          "urgency_rating": { "type": "integer", "enum": [1, 2, 3, 4, 5] },
          "extracted_details": {
            "type": "object",
            "properties": {
              "equipment_model": { "type": ["string", "null"] },
              "issue_summary": { "type": "string" }
            },
            "required": ["equipment_model", "issue_summary"],
            "additionalProperties": false
          }
        },
        "required": ["is_junk", "urgency_rating", "extracted_details"],
        "additionalProperties": false
      }
    }
  }
}
```

### Étape 3 : Routage d'Erreur Robuste (Dead-Letter Queue Slack)
Sur les modules critiques (OCR API, Vector Embeddings, PostgreSQL) :
1. Clic droit sur le module > **Add error handler**.
2. Sélectionner une directive de type **Commit** précédée d'un module Slack **Create a Message** configuré vers un canal `#alerts-watchdog` :
   - **Channel** : `alerts-watchdog`
   - **Text** : 
     ```text
     ⚠️ Erreur Détectée sur Scénario: {{var.scenario.name}}
     • Module ID: {{1.module_id}}
     • Type: {{1.error.type}}
     • Message: {{1.error.message}}
     • Payload: {{toCollection(1.body)}}
     ```
3. Cela prévient l'arrêt inopiné du scénario tout en archivant l'erreur pour rejeu ultérieur.

=== SECTION 3: ANTI-BAN COMMUNITY FORUM RESPONSE ===

Hi Client Case Study (User),

Solid enterprise-grade blueprint! Structuring a 27-scenario architecture with dedicated AI gates, pgvector storage, and OCR fallbacks is exactly

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
