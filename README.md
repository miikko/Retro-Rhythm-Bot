# Retro-Rhythm-Bot

Plays audio from youtube videos and certain files (check resources folder). Uses puppeteer to fetch video urls from Youtube and feeds them to ytdl that generates audio streams from them.

## Requirements

* Node

## Setup

1. Clone this repository
2. Run `npm install` inside the cloned project folder
3. Set environment variables
4. Set environment variables (More on this in the Configuration section) 

To run this project , run `npm start` inside the cloned project folder.

## Configuration

 In order to use this server, the following environment values should be set:
 * DISCORD_TOKEN: A discord bot token that you can get by creating an application [here](https://discordapp.com/developers/applications/).

 One way to setup environment variables is to use the [dotenv module](https://www.npmjs.com/package/dotenv) (included in package.json).

## Commands

TODO


## Deploying to heroku

A special buildpack is required because of puppeteer. Check [this](https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack).