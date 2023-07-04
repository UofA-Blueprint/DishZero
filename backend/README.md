# DishZero Backend

## Local Development
Clone the repository, cd into the `backend` directory, and run:
```
yarn
```
this will install all the dependencies. then run:
```
yarn dev
```
this will start the server on port 8080 but can updated from `default.json` file in `config` directory or by setting `PORT` environment variable.

## Test
To run the tests, run:
```
yarn test
```
the test are still under development and will be updated soon.

## Build
To build the project, run:
```
yarn build
``` 
this will create a `build` directory with all the compiled files. Now to run the server, run:
```
yarn start
```
this will start the server in production mode.

## Routes
all the available routes are defined in the `src/routes` directory. The routes are defined using the `express` router. The routes are then imported in the `src/app.ts` file and are mounted on the `/api` path.

### Auth
The auth routes are defined in the `src/routes/auth.ts` file. The routes are mounted on the `/auth` path. The routes are:
- #### POST `/api/auth/login`
    This will login the user and return a session cookie. if the user is not registered, then it will register the user with customClaims and then return the session cookie.
    
    headers:
    ```
    x-api-key: preset constant api key
    ```
    body:
    ```
    idToken: firebase idToken generated after successful login using frontend firebase client
    ```
- #### POST `/api/auth/logout`
    This will logout the user and clear the session cookie.
    
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

### Dish
The dish routes are defined in the `src/routes/dish.ts` file. The routes are mounted on the `/dish` path. The routes are:
- #### GET `/api/dish?transaction=`
    This route returns all the dishes in the database.
    
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```
    query:
    ```
    transaction: if set to yes, then dishes will be returned with transaction details
    ```

### Transaction
The transaction routes are defined in the `src/routes/transaction.ts` file. The routes are mounted on the `/transactions` path. The routes are:
- #### GET `/api/transactions`
    This route returns all the transactions in the database only if the user is admin.
    TODO: return transactions based on a specific user and role
    
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

### User
the user routes are defined in the `src/routes/user.ts` file. The routes are mounted on the `/users` path. The routes are:
- #### GET `/api/users?role=`
    This route returns all the users in the database only if the user is admin.
    
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```
    query:
    ```
    role: only return users with this role
    ```

- #### GET `api/users/session`
    This route returns the user details of the logged in user and verify the session cookie.

    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```
