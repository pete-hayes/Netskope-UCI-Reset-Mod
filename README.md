# Netskope UCI Reset Mod
A Tampermonkey userscript that adds a **Reset UCI Score** link beside the active user in the dashboard for Netskope Advanced Behavior Analytics. Clicking the link triggers the Netskope UCI (User Confidence Index) reset API for the selected user, and a small colored dot shows success or failure.

## Features
- Adds a **Reset UCI Score** link next to each user
- A circle indicator reflects the UCI reset status:
  - 🟠 Request in progress  
  - 🟢 Success  
  - 🔴 Failure  
  - ⚪ Idle or after switching to a new user  
- Debug logging in the browser console

## Demo
https://github.com/user-attachments/assets/05b86439-51ce-4cd1-9a4d-964a49fa5237

## Prerequisites
- [Tampermonkey](https://tampermonkey.net/)
- Netskope API key for the **/api/v2/incidents/users/uci/reset** endpoint:
  - Create a role, and select the functional area **Behavioral Analytics** and set **External UCI Impact** to `Manage`
  - To obtain an API key, create a Service Account with the UCI role assigned to it.

## Usage
1. Click **Create a new script...** in the Tampermonkey extension menu
2. Copy and paste the contents of [`uci-reset-mod.user.js`](./uci-reset-mod.user.js) into the editor.
3. Edit the script to match your Netskope FQDN and provide your API key.
4. Save the script.
5. Open **Incidents > Behavior Analytics** within your Netskope Administrator Portal
6. Click a user with a score of less than 1000
7. Click **Reset UCI Score**

## License
Licensed under MIT — free to use, modify, and share, with no warranty.

## Disclaimer
This project is **not affiliated with or supported by Netskope**. It may be incomplete, outdated, or inaccurate. Use at your own risk.
