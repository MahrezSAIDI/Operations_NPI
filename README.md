Prérequis

Avant de commencer, assurez-vous d’avoir installé les outils suivants :

    Docker
    Docker Compose
    Git

Étapes d'installation

Étape 1 : Cloner le projet

Commencez par cloner le projet en local en exécutant la commande suivante dans votre terminal :


git clone https://github.com/MahrezSAIDI/Operations_NPI.git

Étape 2 : Construire et lancer le projet

Ouvrez PowerShell en mode administrateur.

Exécutez les commandes suivantes pour configurer le réseau et lancer les conteneurs :

    docker network create mynetwork
    
    docker-compose up --build

Étape 3 : Accéder aux interfaces

Une fois les conteneurs démarrés, accédez aux interfaces en ouvrant votre navigateur aux adresses suivantes :

Interface utilisateur : 

  http://localhost:3000/
  
Documentation Swagger de l'API : 

  http://localhost:8000/docs#/

Vous devriez voir les interfaces suivantes :

![Capture d'écran 2024-10-25 014103](https://github.com/user-attachments/assets/0bc4fcc9-879b-44b5-b2b3-72552fc01ba7)
![swagger](https://github.com/user-attachments/assets/0c0ed8b2-4661-45a7-bf64-0884905da2f1)


Exemples de calculs :


![ecranNPI](https://github.com/user-attachments/assets/1b617695-4986-4e82-b367-90b5ab6db724)





