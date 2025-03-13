### con
API - GEMINI
DB - AWS Dynamo
ND - LOCAL

set -a
source .env
set +a

button command's custom id is <name-arg1-arg2>
Like <champLane-1-Top>

    volumes:
      - type: bind
        source: .
        target: /app

      - type: bind
        source: ./node_modules
        target: /app/node_modules