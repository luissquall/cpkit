# cpkit

cpkit is a command line tool to retrieve accounts, domains, emails and more from cPanel servers.

## Install

```bash
npm install -g cpkit

# Add cPanel server URL & root API key to ~/.cpkitrc
# Replace url & key properties with your settings
cat << EOF > ~/.cpkitrc
{
  "url": "https://server.domain.com:2087",
  "key": "11111111111111111111111111111111"
}
EOF
```

## Usage

```bash
# List commands available
cpkit -h

# List packages
cpkit listpackages

# List accounts
cpkit listaccounts

# List email accounts
cpkit listemails

# List domains
cpkit listdomains
```

