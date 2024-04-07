<div align="center">
  <h3 align="center">ShopTrack</h3>

  <p align="center">
   ShopTrack is a shopping list management application that facilitates the organization and planning of shopping. It allows the creation of multiple lists, adding products, and managing them in an intuitive manner.
</div>

</br>

<h2>Screenshots</h2>

<p align="center"><img src="https://i.imgur.com/ey5iBM8.png" /><img src="https://i.imgur.com/QU07I19.png" /><img src="https://i.imgur.com/Nt6mxw0.png" /><img src="https://i.imgur.com/uVYOYM2.png" /></p>

### Built With

ShopTrack consists of two main parts: a backend API (`my-shoptrack-api`) and a frontend application (`my-shoptrack-app`).

### Backend (my-shoptrack-api)

- **Node.js** and **Express**: Server and framework for handling web applications.
- **MySQL2**: MySQL client for database communication.
- **BCrypt**: Library for hashing passwords.
- **Cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- **Dotenv**: Loading environment variables from a `.env` file.
- **Jsonwebtoken**: Implementation of JWT tokens for authentication and authorization.

### Frontend (my-shoptrack-app)

- **React**: Library for building user interfaces.
- **Material-UI** and **Tailwind CSS**: CSS frameworks for styling.
- **Heroicons** and **React Icons**: Icon libraries.
- **React Router**: Navigation in React applications.
- **React Toastify**: Toast/alert components for user feedback.
- **Date-fns**: Library for manipulating and formatting dates.
- **React Day Picker** and **React Datepicker**: Calendar components for date selection.

### Running the Backend

   Navigate to the `my-shoptrack-api` directory and execute the following commands to install dependencies and start the backend:

    cd my-shoptrack-api
    npm install
    
### Running the Frontend

   In a new terminal, navigate to the `my-shoptrack-app` directory and execute the following commands to install dependencies and start the frontend:

    cd my-shoptrack-app
    npm install
    npm run dev

   The `npm run dev` command will start the frontend and connect it to the backend. The frontend application will be available at `http://localhost:3000`.

## API Endpoints

- `GET /`: Checks if the API is working.
- `POST /register`: Registers a new user.
- `POST /login`: Logs in a user and returns a JWT token.
- `GET /lists`: Returns all shopping lists for the logged-in user.
- `POST /lists`: Creates a new shopping list for the logged-in user.
- `GET /lists/:listId/items`: Returns all items for a given shopping list.
- `POST /lists/:listId/items`: Adds a new item to a specified shopping list.
- `DELETE /items/:itemId`: Deletes a specified item from the shopping list.
- `PATCH /items/:itemId/purchase`: Marks an item as purchased.
- `DELETE /lists/:listId`: Deletes a specified shopping list along with its items.
- `PATCH /lists/:listId/pin`: Pins a specified shopping list.
- `PATCH /lists/:listId/unpin`: Unpins a specified shopping list.

## Database Configuration

To run the ShopTrack API, you must have a working MySQL instance. Use the following environment variables to configure the database connection in the `.env` file in the main directory of `my-shoptrack-api`:

```plaintext
DB_HOST=database_host_address
DB_USER=database_username
DB_PASS=database_password
DB_NAME=database_name
JWT_SECRET=your_jwt_secret

