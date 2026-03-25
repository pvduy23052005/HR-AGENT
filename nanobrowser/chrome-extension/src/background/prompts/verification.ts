export const VERIFICATION_PROMPT =
  `Analyze this GitHub profile page.
        CRITICAL RULE:
        If the page shows "404", "Not Found", or is NOT a valid GitHub profile page, immediately return exactly this JSON and nothing else:
        {
          "isVerified": false,
          "name": null,
          "phone": null,
          "age": null,
          "email": null,
          "school": null,
          "topLanguages": [],
          "probedProjects": [],
          "githubStars": 0,
          "aiReasoning": "Link GitHub không tồn tại."
        }

        Otherwise perform these tasks:
        1. Extract the candidate’s personal information from the profile README or bio:
          - Name
          - Phone number (if visible)
          - School/University
          - If a birth year (for example: 2005) appears in the username or email, calculate the age from that year. If not found, set age = null.

        2. Locate the "Pinned" repositories section.
          Only analyze repositories in this section.

        3. For each pinned repository extract:
          - projectName
          - programming language
          - star count
          - repository URL

        OUTPUT RULES:
        - Return ONLY pure JSON.
        - Do NOT use markdown.
        - Do NOT wrap the response in code blocks.
        - Do NOT include explanations outside the JSON.
        - The JSON must strictly follow this structure:

        {
          "isVerified": true,
          "name": "<string: Candidate full name>",
          "email": "<string or null. CRITICAL: Do NOT use placeholders like [EMAIL]. If the email is hidden, redacted by filters, or not clearly visible, you MUST return null>",
          "phone": "<string or null>",
          "age": <number or null>,
          "school": "<string or null>",
          "githubStars": <number: total stars across all pinned projects>,
          "topLanguages": ["<unique programming languages from pinned projects>"],
          "probedProjects": [
            {
              "name": "<name of the pinned project>",
              "language": "<programming language or null>",
              "stars": <number, 0 if none>,
              "url": "<string: absolute URL to the project>"
            }
          ],
          "aiReasoning": "<one sentence evaluation of the candidate based on pinned projects>"
}`