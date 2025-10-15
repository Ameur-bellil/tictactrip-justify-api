#!/bin/bash

# 🔹 Config
API_URL="http://localhost:8080"
EMAIL="test@example.com"
WORD_BATCH="word word word word word"  # 5 mots par batch
BATCH_COUNT=20000                        # Nombre de requêtes
MAX_WORDS=80000
TOTAL_WORDS=0

# 🔹 Obtenir le token
TOKEN=$(curl -s -X POST "$API_URL/api/token" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}" | jq -r '.token')

if [ -z "$TOKEN" ]; then
  echo "❌ Impossible d'obtenir le token"
  exit 1
fi

echo "[Logger] : Token obtenu"

# 🔹 Envoyer les requêtes
for i in $(seq 1 $BATCH_COUNT); do
  WORDS_TO_SEND=$(echo "$WORD_BATCH" | wc -w)
  TOTAL_WORDS=$((TOTAL_WORDS + WORDS_TO_SEND))

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/api/justify" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: text/plain" \
    -d "$WORD_BATCH")

  if [ "$STATUS" -eq 402 ]; then
    echo "[Logger] : Limite atteinte après $TOTAL_WORDS mots (status 402)"
    break
  elif [ "$STATUS" -ne 200 ]; then
    echo "[Logger] : Requête #$i échouée, status HTTP = $STATUS"
    break
  fi

  if (( i % 1000 == 0 )); then
    echo "[Logger] : Mots envoyés jusqu'à présent : $TOTAL_WORDS"
  fi
done

echo "[Logger] : Test terminé. Total mots envoyés : $TOTAL_WORDS"
