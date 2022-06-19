# Two Rooms and a Boom

A webapp to run in-person games of Two Rooms and a Boom,
where your phone is the card.

## Features

You can run multiple games at once, games will be dropped at any time when 0 players are connected.

The creator of the game chooses which cards to use (called a playset),
and the structure of the rounds (how many round there are, how many minutes each one lasts, and how many hostages to send), but there's a button to just use the default round structure as given in the rulebook.

The number of cards must be equal to the number of players, or you can have one
more card than there are players, in which case the game will automatically bury one card at random.

Every player will be able to see the round timer in the top left, and it will only advance rounds when the creator of the lobby clicks the advance round button.

When the game starts, every player is dealt a card from the playset.
The player's card is always face down unless they hold the card share or color share button.

There's a screen accesible by swiping right which shows the current playset,
the round structure with the current round highlighted, and a checkbox to perform a public reveal.

The game doesn't know or care what room anyone is in, the goal is just for your phone
to be a glorified physical card, augmented with some extra info like the current playset and the round timer.
The special cards like Zombie and Drunk aren't supported yet.

## Structure

The server lives in `src/server`, there's only one file.

The frontend is a React app, bootstrapped by create-react-app, and lives in `src/frontend`

There are some shared types and such in `src/shared`, which should be identically mirrored in `src/frontend/shared`.
Why mirrored? Because CRA won't let you import files outside the source directory. Why not symlink?
I needed this to work on windows and linux and the symlinks seem to behave differently, maybe I didn't check the symlink box when I installed git bash.

## Development

There are, unfortunately, three scripts to run.
In the top level directory, run `tsc --watch`, which will build the server file as you save changes.
Also in the top level, run `node mirrorShared.js`, to mirror the contents of `src/shared` to
`src/frontend/shared`. The mirroring only happens from `src/shared` -> `src/frontend/shared`,
not the other way, so don't edit the copy in the frontend folder.
Lastly, in `src/frontend`, run `npm start`, which will rebuild the frontend as you make changes.
It doesn't track everything, like adding files to the public directory, so you may need to `npm run build`
sometimes, make sure you use the right script for your OS so that the env variables get set correctly.

## Deployment

The dockerfile should work fine, just run `docker-compose up --build`,
but making an SSL cert available to the container was annyoingly difficult
so I abandoned the docker deployment.

If you're interested in deploying this for your own use, the dockerfile works and you can run this as a container
so long as you mount the certs as a volume or something and remove the DEV environment variable
so that it uses https.

Instead, I set up a remote repository on a GCP VM and added a git hook so that whenever
code is pushed to that repository, it goes to another folder and pulls that repository,
so that it has all of the source code, then builds a production build (`npm run build-linux`),
and restarts the systemd service that runs the server file in `build/server/server.js`.
Works great, easy one command deployments, and it has the SSL certs.
