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

this will start the server on port 8080 but can updated from `default.json` file in `config` directory or by setting
`PORT` environment variable.

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

all the available routes are defined in the `src/routes` directory. The routes are defined using the `express` router.
The routes are then imported in the `src/app.ts` file and are mounted on the `/api` path.

### Auth

The auth routes are defined in the `src/routes/auth.ts` file. The routes are mounted on the `/auth` path. The routes
are:

-   #### POST `/api/auth/login`

    This will login the user and return a session cookie. if the user is not registered, then it will register the user
    with customClaims and then return the session cookie.

    headers:

    ```
    x-api-key: preset constant api key
    ```

    body:

    ```
    idToken: firebase idToken generated after successful login using frontend firebase client
    ```

-   #### POST `/api/auth/logout`
    This will logout the user and clear the session cookie.
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

### Dish

The dish routes are defined in the `src/routes/dish.ts` file. The routes are mounted on the `/dish` path. The routes
are:

-   #### GET `/api/dish?all=&transaction=&id=&qid=`

    This route returns all the dishes in the database.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    query:

    ```
    all (admin only): if set to true, then all dishes will be returned.
    transaction: if set to true, then dishes will be returned with transaction details
    id: if set, then only the dish with this id will be returned
    qid: if set, then only the dish with this qid will be returned
    ```

-   #### POST `/api/dish/create`

    This route will create a new dish in the database only if user is an admin.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    body:

    ```
    dish: {
        qid: number,    * required
        registered: string,
        type: string,   * required
    }
    ```

-   #### POST `/api/dish/borrow?qid=`

    This route will borrow a dish if the user is logged in and the dish is available. The route will also create a
    transaction in the database.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    query:

    ```
    qid: qr_code of the dish to be borrowed
    ```

-   #### POST `/api/dish/return?qid=&id=`

    This route will return a dish if the user is logged in and the dish is borrowed by the user. The route will also
    update the transaction in the database.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    query:

    ```
    qid: qr_code of the dish to be returned
    id: id of the dish to be returned (required if qid is not provided)
    ```

    body:

    ```
    returned: {
        condition: string,  * required
    }
    ```

    allowed values for condition:

    ```
    Condition {
        'small_crack_chip',
        'large_crack_chunk',
        'shattered',
        'good',
    }
    ```

-   #### POST `/api/dish/condition?id=`

    This route will update the condition for the dish.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    query:

    ```
    id: id of the dish
    ```

    body:

    ```
    {
        condition: string,    * required
    }
    ```

    allowed values for condition:

    ```
    Condition {
        'small_crack_chip',
        'large_crack_chunk',
        'shattered',
        'good',
    }
    ```

### Transactions

The transaction routes are defined in the `src/routes/transaction.ts` file. The routes are mounted on the
`/transactions` path. The routes are:

-   #### GET `/api/transactions?all=`
    This route returns all the transactions in the database is user is admin and all is set to `true`. Otherwise returns
    all the transactions based on the user_id retrieved from the session cookie.
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```
    query:
    ```
    all: if set to `true`, then all the transactions will be returned only if the user is admin
    ```

### User

the user routes are defined in the `src/routes/user.ts` file. The routes are mounted on the `/users` path. The routes
are:

-   #### GET `/api/users?role=&id=`

    This route returns all the users in the database only if the user is admin.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    query:

    ```
    role: only return users with this role
    id: return the user with this id
    ```

-   #### GET `api/users/session`

    This route returns the user details of the logged in user and verify the session cookie.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

-   #### POST `api/users/modify/:type`

    This route is used to modify the user data. The type can be `role` or `user`. The body should contain the `uid` of
    the user and the new value of the type.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    body:

    ```
    user: {
        id: string,     * required
        role: string,
        email: string,  * required
    }
    ```

    notes: when type is set to role, role property is required and only admin can update the role.

### QR Codes

the qr code routes are defined in the `src/routes/qrCode.ts` file. The routes are mounted on the `/qrcode` path. The
routes are:

-   #### GET `/api/qrcode?qid=`

    This route returns all the qr codes in the database only if the user is admin.

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    query:

    ```
    qid: return the qr code with this qid
    ```

-   #### POST `/api/qrcode/create`

    Create a qr code with the given request body only if user is admin

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    body:

    ```
    qrCode: {
        qid: number,     * required
        dishId: string,  * required
    }
    ```

-   #### POST `/api/qrcode/update`

    Update an existing qr code with the given request body only if user is admin

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    body:

    ```
    qrCode: {
        qid: number,     * required
        dishId: string,  * required
    }
    ```

-   #### DELETE `/api/qrcode?qid=`
    This route deletes the qr code with the given qid only if the user is admin.
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```
    query:
    ```
    qid: delete the qr code with this qid
    ```

### Cron

the cron routes are defined in the `src/routes/cron.ts` file. The routes are mounted on the `/cron` path. The routes
are:

-   #### GET `/api/cron/email`

    Returns information about the email cron

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

-   #### POST `/api/cron/email/enable`

    Enables/disables email cron

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    body:

    ```
    enabled: boolean
    ```

-   #### POST `/api/cron/email/template`

    Updates email template

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    body:

    ```
    template : {
        subject : string,
        body : string
    }
    ```

-   #### POST `/api/cron/email/expression`

    Updates email cron expression

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

    body:

    ```
    days : {
        monday : false,
        tuesday : false,
        wednesday : true,
        thursday : false,
        friday : false,
        saturday : false,
        sunday : false
    }
    ```

-   #### POST `/api/cron/email/stop`

    Stops the cron job

    headers:

    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```

-   #### POST `/api/cron/email/start`
    Starts the cron job with the current expression in the database (stopping any previous running cron job)
    headers:
    ```
    x-api-key: preset constant api key
    session-token: generated sessionCookie from firebase after login
    ```
