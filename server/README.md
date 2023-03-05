# AREA backend

This is the backend of the AREA project. It is developed using Nestjs and a Prisma Database.

## Features

- Swagger: Users can view and test the API routes at http://localhost:8080/api.
- Authentication: Users can register and login.
- Google Oauth: Users can connect their Google account.
- Basic Services: Users can use common services such as Time, Crypto, Weather, and OnePiece.
- OAuth Services Support: Users can connect their Twitter and Twitch accounts to use actions.
- Create Bricks: Users can create their own bricks to use in their workflows.
- Link Actions and Reactions: Once an action in a brick activates, it triggers all reactions in the same brick.

## Getting Started

To get started with the AREA backend locally, follow these steps:

- Clone the repository to your local machine.
- Create a .env file following the .env.exemple file.
- Build the Docker image using `docker compose build`
- Run the Docker container using `docker compose up`
- To initiate basic database data, you can run `node src/fixtures.ts` (loaded on build)
- You can now access the API at http://localhost:8080.
