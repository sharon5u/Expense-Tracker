# Prompt log

Tools used: ChatGPT for earlier setup guidance; Codex for implementation; a fresh
Codex subagent with no build-conversation history for the independent review.

This is a partial verbatim log of prompts available in this conversation, not an
invented transcript or a claim to include every earlier prompt. The student should
add any other actual prompts used, especially their questions about React Native.

## User build request

```text
ok, build the app according to my spec. Read SPEC.md in this project. Implement the full mobile app exactly as specified.
This is an Expo project using Expo Router, so screens belong in src/app/.
Check package.json for the exact Expo SDK version and write code for that version.
Create all necessary files, components, and navigation. Make sure that appropriate data is persistent.
Avoid security risks for sensitive data.  Include proper error handling.
Make sure the app starts without errors and displays the home screen correctly.
```

## User follow-up authorizing the build

```text
don't worry about this part, now build the app and tell me what to do next according to the assignment instructions
```

The follow-up included a screenshot of a GitHub commit containing SPEC.md.

## Independent review prompt (sent by the coordinating agent, not the student)

```text
You are the independent fresh review agent for a homework assignment. Review only SPEC.md and project code in /Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/expense-tracker. Read AGENTS.md. Review raw commit 7bc24e8 against every numbered acceptance criterion. Check bugs, error handling, React Native practices, and data persistence. Write REVIEW.md at project root, numbered findings marked [PASS], [FAIL], or [WARN], with file names and line numbers. PASS means static implementation evidence, not verified device testing; be explicit. Do not fix anything. Do not install dependencies or perform network operations. You have not seen build conversation; use only files. Report completion and significant findings.
```

## Interventions and limitations (factual notes, not prompts)

- The student wrote SPEC.md and made a small starter-text change before the build.
- The original local folder was not writable from this chat, so the agent copied
  the existing project to outputs/expense-tracker and implemented it there.
- The student's GitHub screenshot showed a prior spec commit; the output copy has
  its own local history. No remote push is claimed.
- Package installation was attempted but blocked by network/permission restrictions.
- The agent preserved raw build output in commit 7bc24e8 before the fresh review.
- The student must perform and record actual device tests and personal reflections.

- The student ran `npm install` in the delivered copy after the agent download was blocked. Subsequent typecheck and lint passed and iOS export succeeded.
