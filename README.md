# Serverless - AWS lambda Typescript

## Features

- Supports `sls package`, `sls deploy` and `sls deploy function`
- Supports `sls invoke local` + `--watch` mode
- Integrates nicely with [`serverless-offline`](https://github.com/dherault/serverless-offline)

## Prerequisites

- [`serverless-framework`](https://github.com/serverless/serverless)
- [`node.js`](https://nodejs.org)
- To deploy API must have AWS account configured using

```
$ aws configure
```

where `myApiName` should be replaced with the name of your choice.

Then change directory to the newly created one:

```
cd myApiName
```

And run:

```
npm install
```

or:

```
yarn install
```

To Deploy:

```
npm deploy
```

Following endpoints and functions will be deployed and generated:
endpoints:
POST - https://q91042exjb.execute-api.ap-southeast-2.amazonaws.com/users
GET - https://q91042exjb.execute-api.ap-southeast-2.amazonaws.com/users/{id}
DELETE - https://q91042exjb.execute-api.ap-southeast-2.amazonaws.com/users/{id}
functions:
createUser: userApi-dev-createUser
getUser: userApi-dev-getUser
deleteUser: userApi-dev-deleteUser

```
To Test
```

## create a new user

curl --location --request POST 'https://q91042exjb.execute-api.ap-southeast-2.amazonaws.com/users' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "niraj12",
"email": "test@email.com",
"dob": "23/01/1977"
}'

## Get user

curl --location --request GET 'https://q91042exjb.execute-api.ap-southeast-2.amazonaws.com/users/f75a45e6-43ad-4622-88a0-209585637dab'

## Delete User

curl --location --request DELETE 'https://cwyl7ynv9h.execute-api.ap-southeast-2.amazonaws.com/users/92c16a46-51a0-4713-b9bb-ee916e7d51ff'

## Licence

MIT.
