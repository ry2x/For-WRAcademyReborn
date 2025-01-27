# Typescript-Discord.js-v14-Template with pNpM!

A quick-start template for Discord.js v14 in Typescript with yarn that contains handling for commands, events, and interactions!

> This project is a fork of [TSLARoadster/TypeScript-Discord.js-v14-Template](https://github.com/TSLARoadster/TypeScript-Discord.js-v14-Template)

#### Supported Features
|Feature|Available|
----|:---:
|Slash Command| ✅ |
|Button| ✅ |
|ContextMenu| ✅ |
|Modal| ✅ |
|SelectMenu| ✅ |
|AutoComplete| ✅ |

## Installation

1. Clone this project with
   ```bash
   $git clone https://github.com/ry2x/TypeScript-Discord.js-v.14-template.git
   ```
2. Install dependencies with
   ```bash
   $pnpm install
   ```
3. Install hasky [[?]](https://www.npmjs.com/package/husky)_What is hasky_
   ```bash
   $pnpm run prepare
   ```

## Configuration
1. Edit `./src/RENAME.env`


   You'll need `client_id`, `TOKEN` and `guild_id`  [[?]](https://discord.com/developers/applications) _You can get them at [here](https://discord.com/developers/applications)._

2. Rename `RENAME.env` to `.env`
3. Edit `./src/config.json`
   
   Change "!" to configure your prefix
   ```json
   {
    "prefix": "!"  
   }
   ```
   