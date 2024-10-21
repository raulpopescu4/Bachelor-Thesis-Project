# Fight Finder: MMA Fights and Fighters Recommender

Fight Finder is a web-based recommender system designed for MMA enthusiasts, particularly fans of UFC. It leverages advanced AI technologies to deliver personalized fight recommendations based on individual preferences and user interactions, addressing the challenge of content overload for both new and seasoned fans.

## Features
- **Personalized Recommendations**: AI-powered suggestions tailored to user preferences using dynamic profiling.
- **User Interaction**: Ability to bookmark fights, provide feedback, and manage preferences to improve recommendations.
- **Continuous Learning**: The system dynamically updates user profiles based on ongoing interactions, refining the recommendations over time.

## Tech Stack
- **Frontend**: [React.js](https://reactjs.org/)
- **Backend**: [Django REST Framework](https://www.django-rest-framework.org/)
- **AI Integration**: [OpenAI API](https://platform.openai.com/docs/overview) (GPT for generating recommendations)
- **Database**: SQLite (easily scalable to PostgreSQL)

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/raulpopescu4/Bachelor-Thesis-Project.git
   cd Bachelor-Thesis-Project

2. **Install dependencies**:
    ```bash
    # Frontend
    cd frontend
    npm install

    # Backend
    cd ../backend
    pip install -r requirements.txt

3. **Run the application**:
    ```bash
    # Frontend: In a separate terminal, start the React development server:
    npm start

    # Backend: Start the server by running:
    python manage.py runserver

The application will now be accessible at http://localhost:3000/ (frontend) and http://localhost:8000/ (backend).

## Notable Aspects
- **AI-Driven Personalization**: Uses OpenAI's GPT to generate highly relevant recommendations by combining user data with advanced prompt engineering techniques.
- **Hybrid Approach**: Combines traditional recommendation algorithms with AI-based techniques to improve accuracy and relevance.
- **Scalability and Flexibility**: Designed to handle large volumes of data, with a modular architecture that allows for easy scaling.

Contact
For more information, reach out to:

Author: Raul Catalin Popescu
Email: raulpopescu4@gmail.com
