#!/usr/bin/env node

const resolve = require('path').resolve;
const spawn = require('child_process').spawn;
const argv = process.argv;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const command = 'changelog-maker';
const args = [
    '--group'
];

const child = spawn(command, args, { stdio: 'inherit' });