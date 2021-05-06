# Reviews Scraper

## Setting up EC2

### Install Node

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install node

node -e "console.log('Running Node.js ' + process.version)"

```

### Install Git

```

sudo yum update -y

sudo yum install git -y

```

### Install Chromium & extras

```

sudo amazon-linux-extras install epel -y

sudo yum install -y chromium

```

### Get repo

```

git clone https://github.com/tomdmitchell/digicogs-reviews-scraper.git

cd digicogs-reviews-scraper

npm install

```

### Start Script & Detach with Screen

```

screen

GENRE=electronic STYLE=xxxxxxx npm start

ctrl+A ctrl+D

```

### Resume Session

```

screen -r

```

## Tracker

https://docs.google.com/spreadsheets/d/1XgM9Jb9HBZYkWGkvQ_1_nclfKGwwWlags5WXXJsyUGQ/edit?usp=sharing

## Related Repos

### Data Store

https://github.com/tomdmitchell/digicogs-data-store

### Release IDs Scraper

https://github.com/tomdmitchell/digicogs-release-ids-scraper
