![](/static/banner-transparent.png)
*Broadcast Asset Live Tool for Real-time Overlay Utility*

# How to run
1. Download nodejs

Go check their download page, also install npm and pnpm

2. install packages

execute the following command
```bash
pnpm install --prod
```
3. Add the environnement file

Add a file name `.env` which contains
```bash
TWITCH_CLIENT_ID="Your application id" #Change this value
TWITCH_CLIENT_SECRET="your application secret" #Change this value
TWITCH_SCOPE="chat:read chat:edit user:write:chat user:read:email channel:read:subscriptions bits:read user:read:follows"
```
You can get these values from the twitch developper panel

4. Start the app
```bash
node build/index.js
```
