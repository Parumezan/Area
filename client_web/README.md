# <p align="center">💻 Client web 🌐</p>

<p align="center">
  <a href="https://en.wikipedia.org/wiki/API">
  <img src="https://cdn.discordapp.com/attachments/1021809556625559634/1082031995611271168/image.png">
</p>

## 📋 Table of Contents
<details>
<summary>Click to reveal</summary>

- [About](#-about)
- [Requirements](#-requirements)
- [Building](#-building)
- [Usage](#-usage)
- [Authors](#-authors)

</details>

## 🔍 About

[Area](https://en.wikipedia.org/wiki/API) is a 3rd year Epitech project about creating an IFTTT-like web client and mobile app.

## 💻 Requirements

Supported operating systems:
- Windows (tested on Windows 10 Home 21H1 x64)
- Linux (tested on Ubuntu 2204 and Fedora 32)
- MacOS

Dependencies:
- [Docker](https://www.docker.com/)

## 🔧 Building

- Launch docker.
- Run `docker compose build`
- Run `docker compose up`

## 🎮 Usage

You can register with an email and password or through your Google account

Once registered you'll be on the dashboard page

There's a disconnect button at the top right to disconnect your account and you can reconnect (different than register, click the link in the little message below)

There's also a Dashboard button to go to the dashboard page (when in a brick which are talked about down below) and a Services button where you can connect to your Twitter and/or Twitch accounts to use them later

On the dashboard page you can create a new brick by clicking the "+" button

On the brick creation popup that just appeared you can give (or not) the brick's name and/or description

Once the brick is created you can click on its "Edit" button to edit its name/description or delete it (or cancel the Edit)

Bricks hold their own action/reactions connections, feel free to organize your services tasks through them

When you click on a brick (anywhere but on its "Edit" button) you'll access it

In a brick you can create either actions (which will trigger every x seconds/minutes depending on the service and type of action) or reactions (which will take the output from reactions and execute a task with it) by clicking on their appropriate "+" buttons.

The creation popup contains:
- The service (actions have no-authentification services like clock, weather, cypto or One Piece and also auth ones like Twitter and Twitch if you connected to them, reactions only have auth those 2 auth ones)
- The action/reaction type (like get all tweets from an user, get all streamers on Minecraft, activate when a time is reached etc...)
- The arguments to give to that action/reaction (tooltip appears when the mouse hovers the text area)
- The description (not mandatory)

You can then, just like for bricks, click on the "Edit" button of each action/reaction to modify any of its explained-above fields or delete them (or cancel the edit).

## 🤝 Authors

[Pierre HAMEL](https://github.com/pierre1754) • [Dorian AYOUL](https://github.com/NairodGH) • [Jean-Baptiste BROCHERIE](https://github.com/Parumezan) • [Pierre MAUGER](https://github.com/PierreMauger) • [Xavier TONNELLIER](https://github.com/XavTo)