# Retro-Rhythm-Bot

Plays audio from youtube videos and certain files (check resources folder). Uses puppeteer to fetch video urls from Youtube and feeds them to ytdl that generates audio streams from them.

## Commands

TODO

## Requirements

* Node

## Deploying to heroku

A special buildpack is required because of puppeteer. Check [this](https://elements.heroku.com/buildpacks/jontewks/puppeteer-heroku-buildpack).