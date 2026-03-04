# Docker + n8n + Ollama Setup Guide for Mac

## Step 1: Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Step 2: Install Docker CLI
```bash
brew install docker
```

## Step 3: Install OrbStack (Docker daemon for Mac)
```bash
brew install orbstack
```

Start OrbStack from Applications or:
```bash
open /Applications/OrbStack.app
```

Wait for the OrbStack icon to appear in the menu bar.

## Step 4: Verify Docker is working
```bash
docker ps
```

You should see an empty list (no containers yet).

## Step 5: Create n8n data volume
```bash
docker volume create n8n_data
```

## Step 6: Start n8n container
```bash
docker run -d \
 --name n8n \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="AEST" \
 -e TZ="AEST" \
 -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
 -e N8N_RUNNERS_ENABLED=true \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n \
 start --tunnel
```

## Step 7: Start Ollama container
```bash
docker run -d --name ollama -p 11434:11434 ollama/ollama:latest
```

## Step 8: Pull smollm2 model (first time only)
```bash
docker exec ollama ollama pull smollm2
```

This takes a few minutes depending on your internet speed.

## Step 9: Access n8n
Open your browser and go to: **http://localhost:5678**

## Step 10: Configure Ollama in n8n
1. In n8n, add an Ollama node
2. Set Base URL to: `http://ollama:11434` or if using docker `http://host.docker.internal:11434`
3. Leave API Key blank (Ollama doesn't use one)
4. Select model: `smollm2` or any other

## Useful Commands

**Check running containers:**
```bash
docker ps
```

**View container logs:**
```bash
docker logs n8n
docker logs ollama
```

**Stop containers:**
```bash
docker stop n8n ollama
```

**Start containers:**
```bash
docker start n8n ollama
```

**Delete a container (volume persists):**
```bash
docker rm n8n
```

**List volumes:**
```bash
docker volume ls
```

**Delete a volume (WARNING: data is lost):**
```bash
docker volume rm n8n_data
```
