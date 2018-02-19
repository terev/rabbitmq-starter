#!/usr/bin/env node
'use strict';

if (process.env['RABBIT_HOST'] === undefined) {
    console.error("RABBIT_HOST environment variable must be specified");
    process.exit(1);
}

const amqp = require('amqplib');
const retry = require('retry');
const q = 'task_queue'; // Name of task queue

let rabbit_host = process.env['RABBIT_HOST'];

function faultTolerantConnect(cb) {
    const operation = retry.operation();

    operation.attempt(function (currentAttempt) {
        // Connect to our rabbitmq node
        amqp.connect('amqp://' + rabbit_host).then((conn) => {
            cb(null, conn);
        }).catch((err) => {
            if (!operation.retry(err)) {
                cb(err);
            } else {
                console.log("Retrying connection...");
            }
        });
    });
}


faultTolerantConnect((err, conn) => {
    if (err) {
        console.warn(err);
        return;
    }

    const ok = conn.createChannel();

    ok.then((ch) => {
        ch.assertQueue(q, {durable: true});

        // This worker won't receive more work until previous message is acked
        ch.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, (msg) => {
            const secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());

            // Does n dot seconds of work before acking
            setTimeout(function () {
                console.log(" [x] Done");
                ch.ack(msg);
            }, secs * 1000);
        }, {noAck: false});
    }).then(null, console.warn);
});