---
description: Always deploy (git commit and push) after making code changes.
---

# Deploy on Fix
- The user requires that **any time** code changes or fixes are made, they must be immediately committed and pushed to the repository (GitHub) so that the live site (Production/Vercel) deploys the changes.
- **NEVER** wait for the user to ask you to deploy. 
- After making successful code edits using replace_file_content or other file modification tools, you MUST immediately run a `git add .`, `git commit -m "..."`, and `git push` command.
