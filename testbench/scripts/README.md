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
API_KEY can be any string, ADMIN_ID is the ID of an admin user on firestore.

Once you run get_tokens.py, .id_token and .session_token will be created, allowing you to use the other scripts that require the tokens as environment variables.

## Running a script

Run ```get_tokens.py``` before running any scripts that require id and session tokens. To run a script, do ```./<filename>```. For now they print the response by the server.