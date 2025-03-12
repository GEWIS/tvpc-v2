> [!WARNING]
> `tvpc-v2` is obsolete and unmaintained. Please use [aurora-core](https://github.com/gewis/aurora-core) with [aurora-client](https://github.com/gewis/aurora-client) instead.

# GEWIS AViCo TVPC Script (v2)

This repository is a complete rewrite of the TVPC script, 
written by Pieter Kokx many, many years ago. 
Because the old script was written in PHP5.6 with some Javascript and contained several memory leaks,
it was decided to fully rewrite the code behind it. 
This new version is written in Typescript.

## How to run
1. Clone this repository.
2. Install all packages in both the frontend as well as the backend folder with `npm install`
3. Set the environment variables in `backend/.env`.
4. Run `npm run watch` in a terminal in the backend folder.
5. While in the frontend folder, 
compile the Typescript files with `tsc`. 
When you want to debug the code in your browser, run `tsc --sourceMap`.
4. Open index.html.
