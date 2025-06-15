# My Full-Stack Project: Spring Boot Microservices Backend & React Frontend

## 1. Project Overview

This is a full-stack application demonstrating a modern architecture using Spring Boot for a microservices-based backend and React for a dynamic frontend. 

It showcases the integration of multiple backend services, an API Gateway for routing, a service registry for discovery, and a responsive single-page application (SPA) on the frontend. A key feature is the notification system, which sends emails to patients and doctors via Gmail.

## 2. Technologies Used

### Backend (Spring Boot Microservices)

* **Java**: The core programming language.
* **Spring Boot**: Framework for building robust, production-ready, stand-alone Spring applications.
* **Spring Cloud**: For building distributed systems, including:
    * **Spring Cloud Gateway**: For API routing and filtering.
    * **Netflix Eureka (Service Registry)**: For service discovery.
    * **Spring Security**: For authentication and authorization within microservices.
    * **Spring Mail**: For sending email notifications.
* **Maven**: Dependency management and build automation tool.
* **Database**: MySQL
* **Lombok**: Reduces boilerplate code.

### Frontend (React)

* **React**: A JavaScript library for building user interfaces.
* **JavaScript (ES6+)**: Programming language for the frontend.
* **NPM**: Package manager for JavaScript.
* **HTML5 & CSS3**: For structuring and styling the web application.
* **Axios**: For making HTTP requests to the backend.
* **React Router**: For client-side routing.

## 3. Project Structure

The project is organized into two main directories:

* `Backend_Final_10_06/`: Contains all the Spring Boot microservices.
* `FinalFrontend_11.06/`: Contains the React single-page application.

## 4. Setup and Installation

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed:

* **Git**: For version control.
* **Java Development Kit (JDK) 17+**: For Spring Boot.
* **Maven 3.6+**: Build tool for Spring Boot backend.
* **Node.js (LTS version) & npm / Yarn**: For React frontend.
* **Spring Tool Suite (STS)**: (Recommended for Backend development)
* **VS Code**: (Recommended for Frontend development)
* **Mysql Workbench**: - Ensure it's running and accessible.

### 4.1. Backend Setup

1.  **Navigate to the Backend Root:**
    ```bash
    cd Backend_Final_10_06
    ```
2.  **Import Projects into STS:**
    * Open Spring Tool Suite.
    * Go to `File -> Open Projects from File System...`.
    * Click "Directory..." and navigate to `Backend_Final_10_06/`. Select this folder.
    * STS should detect all the individual microservice projects (e.g., `ApiGateway`, `AppointmentService`, etc.). Select all of them and click "Finish".
3.  **Database Configuration:**
    * For each service that interacts with a database (e.g., `PatientService`, `DoctorService`, etc.), locate its `application.properties`  file (usually under `src/main/resources`).
    * Update the database connection details (URL, username, password) to match your local database setup.
        ```properties
        # Example for application.properties
        spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
        spring.datasource.username=your_db_username
        spring.datasource.password=your_db_password
        spring.jpa.hibernate.ddl-auto=update # or none, depending on your preference
        ```
4.  **Gmail Notification Configuration (NotificationService):**
    * Navigate to the `NotificationService` project: `Backend_Final_10_06/NotificationService/NotificationService/src/main/resources/application.properties`
    * **Crucially, replace the placeholder Gmail credentials with your own**:
        ```properties
        spring.mail.username=YOUR_GMAIL_ADDRESS@gmail.com
        spring.mail.password=YOUR_GMAIL_APP_PASSWORD

    * **Important Security Note**:
        * **App Password**: You cannot use your regular Gmail account password directly. You need to generate an "App password" from your Google Account settings if you have 2-Step Verification enabled. Go to your Google Account -> Security -> 2-Step Verification -> App passwords.
        * **Security Best Practice**: Hardcoding credentials directly in `application.properties` is **not recommended for production environments**. For deployment, you should use environment variables, a secrets management service (like HashiCorp Vault), or Spring Cloud Config to inject these values securely at runtime. This practice keeps sensitive information out of your codebase.
5.  **Build Backend Projects (Optional, STS usually builds automatically):**
    * You can build each service individually using Maven:
        ```bash
        # Example for PatientService
        cd PatientService/PatientService
        mvn clean install -DskipTests
        ```
    * Or, in STS, right-click on each project -> `Maven -> Update Project...` and then `Maven -> Clean` followed by `Maven -> Install`.

### 4.2. Frontend Setup

1.  **Navigate to the Frontend Root:**
    ```bash
    cd FinalFrontend_11.06
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    # OR if you use Yarn
    # yarn install
    ```
3.  **Configure API Base URL (if needed):**
    * If your frontend needs to know the backend API Gateway URL, you might have a `.env` file (e.g., `.env.development`) or a configuration file in your React project.
    * Update the API base URL to point to your local API Gateway (e.g., `http://localhost:8080` if your gateway runs on 8080).
        ```
        # Example for .env.development
        REACT_APP_API_BASE_URL=http://localhost:8080
        ```

## 5. How to Run the Application

You need to run the backend services and then the frontend application.

### 5.1. Running the Backend Services (Order Matters!)

**IMPORTANT**: Services should be started in a specific order to ensure proper communication and discovery.

1.  **Start Service Registry (Eureka Server) first:**
    * In STS, locate the `ServiceRegistry` project.
    * Find the main application class (e.g., `ServiceRegistryApplication.java`).
    * Right-click -> `Run As -> Spring Boot App`.
    * Wait for it to start successfully (usually on port 8761 by default). You can verify by opening `http://localhost:8761` in your browser.

2.  **Start Authentication Service (`AuthService-1`):**
    * Start `AuthService-1` as a Spring Boot App. This service is often a prerequisite for others if security is implemented early.

3.  **Start Other Microservices (including `NotificationService`):**
    * Start the remaining services (`ApiGateway`, `AppointmentService`, `DoctorService`, `MedicalHistoryService`, `NotificationService`, `PatientService`) one by one or in parallel as Spring Boot Apps in STS.
    * Ensure they register successfully with the Eureka server (you can check the Eureka dashboard at `http://localhost:8761`).

4.  **Start API Gateway (`ApiGateway`) last:**
    * Ensure the `ApiGateway` is started after all other services it needs to route to are up and registered. This will typically run on port 8080.

### 5.2. Running the Frontend Application

1.  **Navigate to the Frontend Root:**
    ```bash
    cd FinalFrontend_11.06
    ```
2.  **Start the React Development Server:**
    ```bash
    npm start
    # OR if you use Yarn
    # yarn start
    ```
    This will usually open your application in your default browser at `http://localhost:3000` (or another available port).

## 6. Accessing the Application

Once both backend and frontend are running:

* **Frontend**: Open your web browser and navigate to `http://localhost:3000` (or the port indicated by `npm start`).
* **Backend API Gateway**: Your APIs will be accessible through the API Gateway, typically at `http://localhost:8085`. For example, `http://localhost:8085/patients` will route to your Patient Service.

* **Login** : Initially register the admin in Postman to access admin's previledges.
                Credentials: username, password and role= "ADMIN"
                POST URL   : localhost:8085/auth/register     

## 7. Development and Contribution

Feel free to explore the codebase, suggest improvements, or report issues.

### Git Workflow

1.  Clone the repository: `git clone <your-repo-url>`
2.  Create a new branch for your feature/fix: `git checkout -b feature/your-feature-name`
3.  Make your changes.
4.  Commit your changes: `git commit -m "feat: Add new feature"` or `git commit -m "fix: Resolve bug"`
5.  Push to your branch: `git push origin feature/your-feature-name`
6.  Open a Pull Request on GitHub.


**Happy Coding!**