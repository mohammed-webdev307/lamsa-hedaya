Automatic translation added

- AR keeps the original Arabic content.
- EN first uses the built-in curated translations, then automatically translates any remaining Arabic text to English.
- Automatic results are cached in the browser (localStorage) to reduce repeated requests.
- Dynamic text from Supabase, including product names/descriptions shown on the page, is translated when rendered.
- The existing AR/EN button remains the language switch.
- If the external translation service is temporarily unavailable or rate-limited, the built-in translations still work and untranslated text remains unchanged rather than breaking the site.

No Supabase SQL changes are required for this feature.
