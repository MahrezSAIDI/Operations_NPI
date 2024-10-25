# Prerequisites

Before starting, make sure you have the following tools installed:

- **Docker**
- **Docker Compose**
- **Git**

# Installation Steps

## Step 1: Clone the Project

Clone the project locally by running the following command in your terminal:

```bash
git clone https://github.com/MahrezSAIDI/Operations_NPI.git
```

## Step 2: Build and Launch the Project

Open your terminal.

Run the following commands to set up the network and start the containers:

```bash
docker network create mynetwork
docker-compose up --build
```

## Step 3: Access the Interfaces

Once the containers are running, open your browser to access the interfaces at the following addresses:

    
- **User Interface:** [http://localhost:3000/](http://localhost:3000/)

- **API Swagger Documentation:** [http://localhost:8000/docs#/](http://localhost:8000/docs#/)

   

You should see the following interfaces:

![Capture d'écran 2024-10-25 014103](https://github.com/user-attachments/assets/0bc4fcc9-879b-44b5-b2b3-72552fc01ba7)

User Interface Screenshot Swagger API Documentation:

![swagger](https://github.com/user-attachments/assets/0c0ed8b2-4661-45a7-bf64-0884905da2f1)

NPI Calculator Screen

![ecranNPI](https://github.com/user-attachments/assets/1b617695-4986-4e82-b367-90b5ab6db724)
