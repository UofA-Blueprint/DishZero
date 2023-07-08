# Test scripts

## Setup

Install the requirements. 
```
pip install -r requirements.txt
```

Run the server in the ```backend``` directory before running the scripts.
Make the script an executable using ```chmod +x``` before running it

## Environment

Create a ```.env``` file in the scripts directory with the following variables.

```
export API_KEY="api_key"
export ADMIN_ID="admin id"
```
API_KEY is the Web API key of our firebase app and can be found in project settings in the firebase console. ADMIN_ID is the ID of an admin user on firestore.

You will also need a ```credentials.json``` file in the same directory. You can get it from the backend channel in the discord.

Once you run get_tokens.py, .id_token and .session_token will be created, allowing you to use the other scripts that require the tokens as environment variables.

## Running a script

Run ```source .env``` and then ```get_tokens.py``` before running any scripts that require id and session tokens. To run a script, do ```./<filename>```. For now they print the response by the server.