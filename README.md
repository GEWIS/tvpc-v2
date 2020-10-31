# GEWIS AViCo TVPC Script (v2)

This repository is a complete rewrite of the TVPC script, 
written by Pieter Kokx many, many years ago. 
Because the old script was written in PHP5.6 with some Javascript and contained several memory leaks,
it was decided to fully rewrite the code behind it. 
This new version is written in Typescript.

## How to run
1. Clone this repository.
2. Install all packages (Typescript and ESLint) with `npm install`.
3. While in the root directory of the repo, 
compile the Typescript files with `tsc`. 
When you want to debug the code in your browser, run `tsc --sourceMap`.
4. Open index.html.
