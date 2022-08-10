# Codebarker

**prod env**
https://codebarker.net

**staging env**
https://staging.codebarker.net

**design**
https://www.figma.com/file/ie7Jw7cGfREdzJUtvsmCLk/Untitled?node-id=147%3A2

---

An application that allows the user to learn about code smells through community submissions.

- As a user I can view a smell and vote on what smell it is
- As a user I can submit source code from an open source github application as a smell
- As a user I can vote whether I agree or disagree on a potential code smell submission
- As a user I can see an overview of my submissions

## Setup

### Before running

- Have the correct node version (check .nvmrc)
- Make sure you have docker and docker-compose installed so that you can run the internal services (e.g. docker-compose up -d)
- Create a .env.local file and fill in the required secrets that can be found in the .env file

### How to run

- Run docker-compose up -d
  - Run yarn migrate dev
  - Run yarn db:seed
- Run the app with: "yarn nx run web:serve"
  - Recommended to install nx extension in vscode or webstorm to easily start the app
