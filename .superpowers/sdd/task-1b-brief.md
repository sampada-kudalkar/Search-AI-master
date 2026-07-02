# Task 1 (Redo): Install correct deps + copy real myna service files

## Goal
Replace the stub myna files (written from scratch in the previous attempt) with the real source files from the correct branch, install the correct npm packages, and add the Search AI product context.

## Working directory (write here)
`/Users/sampada.kudalkar/Documents/Search AI Q2/Competitors latest/Search-AI-master/.worktrees/ask-birdai`

## Source repo (read-only)
`/Users/sampada.kudalkar/Documents/Dental/birdeyev2`
Branch: `remotes/origin/v2.7.2-myna`
Read files with: `git show remotes/origin/v2.7.2-myna:src/app/myna/<filename>`

## Steps

### 1. Install correct npm dependencies
Run in the working directory:
```bash
npm install @anthropic-ai/sdk @langchain/anthropic @langchain/core zod marked motion
```

### 2. Delete existing stub myna files
```bash
rm -rf src/myna
mkdir -p src/myna
```

### 3. Copy all 8 myna service files from source branch
For each file, use `git show` to read from the source and write to the target:

Files to copy from `src/app/myna/` in birdeyev2 → `src/myna/` in target:
- `mynaAIService.ts`
- `mynaLangChainService.ts`
- `mynaProductContext.ts`
- `mynaSemanticTypes.ts`
- `mynaMockConversations.ts`
- `mynaChatChrome.ts`
- `mynaL2NavKeys.ts`
- `useMynaConversations.ts`

Example read command:
```bash
git -C "/Users/sampada.kudalkar/Documents/Dental/birdeyev2" show remotes/origin/v2.7.2-myna:src/app/myna/mynaAIService.ts
```

Write the output to `src/myna/mynaAIService.ts` in the working directory.

### 4. Fix import paths in copied files
The copied files may use `@/` path aliases (e.g. `import ... from '@/myna/mynaSemanticTypes'`). Replace these with relative paths (e.g. `./mynaSemanticTypes`). Also fix any import from outside the myna folder that doesn't exist in the target — stub or remove those imports.

### 5. Add Search AI product context
In the copied `src/myna/mynaProductContext.ts`, find the `PRODUCT_CONTEXTS` object and add this entry:

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

### 6. Create .env if it doesn't exist
```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

### 7. Run TypeScript check
```bash
npx tsc --noEmit
```
Fix any errors in the myna files (import paths, missing types). Do NOT touch files outside `src/myna/`.

### 8. Commit
```bash
git add -A
git commit -m "feat: copy real myna AI service layer from v2.7.2-myna branch"
```

## Constraints
- Do NOT modify any files in the birdeyev2 source repo
- Only touch: `src/myna/`, `package.json`, `package-lock.json`, `.env`
- If a myna file imports something unavailable in the target, stub that import minimally
