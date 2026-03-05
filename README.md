# AI Analytics Automation using N8N + RAG to increase AI reasoning

A proof-of-concept that connects front-end user behaviour data to an AI-powered automation pipeline, automatically analysing checkout performance and suggesting (or applying) code improvements with human approval.

## How it works

1. **Front-end** collects real user behaviour via **Google Analytics** and **FullStory** during checkout sessions
2. **n8n** ingests the analytics data and triggers an automated workflow
3. **Ollama (local LLM)** analyses the data, identifying drop-off points, UX friction, and conversion issues
4. The pipeline **generates code change suggestions** based on findings
5. A **human approval step** reviews the suggestions before anything is applied

The goal: close the loop between user behaviour and code, without requiring a developer to manually read dashboards every sprint.

## Workflow

### 1st workflow: Gather data, do analysis, send info forward
<img width="1600" height="849" alt="image" src="https://github.com/user-attachments/assets/5cdf3423-87c0-4b6f-8784-d236ebb67603" />

### 2nd workflow: Based on previous analysis, check the actual code (The AI decides which files need change) and change them based on human response
<img width="1600" height="380" alt="image" src="https://github.com/user-attachments/assets/e59f5c0d-387a-4f91-9c1d-bbe64c7bfb86" />
<img width="797" height="692" alt="image" src="https://github.com/user-attachments/assets/f6fb6f9b-28fa-4201-8e0b-e03278a12a2c" />

### Watch for PR's open and notify
<img width="1598" height="968" alt="image" src="https://github.com/user-attachments/assets/bf86f8e8-5205-4b72-b81e-70564a0cc98f" />

## See it in action

Want to see what the pipeline actually produces? Check the **[Issues](../../issues)** and **[Pull Requests](../../pulls)** tabs of this repo, every AI-generated suggestion and code change proposed by the workflow is logged there, including the human approval step before anything gets merged.

## Tech Stack

- **n8n** —> workflow automation and orchestration
- **Ollama** —> local LLM inference (smollm2)
- **Docker** —> containerised setup
- **Google Analytics** —> user behaviour tracking
- **FullStory** —> session replay and interaction data
- **TypeScript** —> front-end integration layer

---

## Local Setup

### Prerequisites
- Mac with Homebrew
- Docker (via OrbStack)

### Step 1: Install Homebrew (if needed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Docker CLI + OrbStack
```bash
brew install docker
brew install orbstack
open /Applications/OrbStack.app
```
Wait for the OrbStack icon in the menu bar before continuing.

### Step 3: Verify Docker
```bash
docker ps
```

### Step 4: Create n8n data volume
```bash
docker volume create n8n_data
```

### Step 5: Start n8n
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

### Step 6: Start Ollama
```bash
docker run -d --name ollama -p 11434:11434 ollama/ollama:latest
docker exec ollama ollama pull smollm2
```

### Step 7: Open n8n
Go to **http://localhost:5678**

### Step 8: Configure Ollama node in n8n
- Base URL: `http://host.docker.internal:11434`
- API Key: *(leave blank)*
- Model: `smollm2`

---

## Useful Commands

```bash
# Check running containers
docker ps

# View logs
docker logs n8n
docker logs ollama

# Stop / start
docker stop n8n ollama
docker start n8n ollama

# Remove container (volume persists)
docker rm n8n

# Remove volume (WARNING: data lost)
docker volume rm n8n_data
```

---

> ⚠️ This is a POC — not intended for production use without additional security review on the human approval flow and LLM output validation.
