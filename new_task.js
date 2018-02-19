#!/usr/bin/env node
'use strict';

const amqp = require('amqplib');

const q = 'task_queue'; // Name of task queue
const msg = process.argv.slice(2).join(' ') || "Hello World!"; // Reads message to send from process arg or defaults

// Connect to local rabbitmq node
amqp.connect('amqp://localhost').then((conn) => {
    const ok = conn.createChannel();

    ok.then((ch) => {
        ch.assertQueue(q, {durable: true});
        ch.sendToQueue(q, new Buffer(msg), {persistent: true});
        console.log(" [x] Sent '%s'", msg);
    });

    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);

    return ok;
}).then(null, console.warn);