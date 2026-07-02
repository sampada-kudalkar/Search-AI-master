# Task 1: Install dependencies + copy myna service layer

## Goal
Install the required npm packages and copy the entire AI service layer from the Birdgpt repo into the Search-AI-master worktree.

## Target repo (write here)
`/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master/.worktrees/ask-birdai`

## Source repo (read-only)
`/Users/sampada.kudalkar/Documents/Birdgpt`

## Steps

### 1. Install dependencies
In the TARGET repo directory, run:
```bash
npm install @langchain/anthropic langchain zod
```

### 2. Create destination directory
```bash
mkdir -p src/myna
```

### 3. Copy these files verbatim from source → target
Copy each file from `Birdgpt/src/app/myna/` to `src/myna/` in the target:

- `mynaAIService.ts`
- `mynaLangChainService.ts`
- `mynaMockConversations.ts`
- `mynaSemanticTypes.ts`
- `mynaChatChrome.ts`
- `mynaL2NavKeys.ts`
- `useMynaConversations.ts`
- `mynaProductContext.ts`

### 4. Patch mynaProductContext.ts
In the copied `src/myna/mynaProductContext.ts`, add a new entry for "Search AI" in the `PRODUCT_CONTEXTS` dictionary (or whatever the export is called). Add this entry:

```typescript
"Search AI": {
  description: "AI-powered competitor analysis — tracks visibility, citation share, and keyword rankings across ChatGPT, Gemini, Perplexity, and Claude.",
  dataSnapshot: {
    visibilityScore: "62%",
    citationShare: "18%",
    topKeyword: "dental implants near me",
    trackedCompetitors: 8,
    platforms: ["ChatGPT", "Gemini", "Perplexity", "Claude"]
  },
  quickActions: [
    "Why is my visibility dropping?",
    "Which competitor is gaining on me?",
    "What topics should I focus on?"
  ]
}
```

### 5. Fix any import path issues
The copied files may reference `@/` aliases or relative paths like `./mynaXxx` that won't resolve properly. Fix any broken imports:
- Imports between myna files should use relative paths like `./mynaProductContext`
- If any file imports from outside the myna directory (e.g., app utilities), check if they exist in the target; if not, stub or remove them

### 6. Create .env file if it doesn't exist
At the root of the target repo, create `.env` with:
```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```
Only create it if there's no `.env` already.

### 7. Verify TypeScript compiles
Run `npx tsc --noEmit` in the target repo. Fix any type errors introduced by the copied files.

### 8. Commit
```bash
git add -A
git commit -m "feat: add myna AI service layer from Birdgpt"
```

## Constraints
- Do NOT modify any files in Birdgpt
- Do NOT touch any files outside `src/myna/`, `package.json`, `.env`
- If a myna file imports something that doesn't exist in target, stub it minimally rather than pulling in more files
